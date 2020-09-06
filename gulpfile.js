import * as Config from "./src/server/config.js";
import del from "del";
import { promises as fs } from "fs";
import gulp from "gulp";
import babel from "gulp-babel";
import debug from "gulp-debug";
import rename from "gulp-rename";
import replace from "gulp-replace";
import sourcemaps from "gulp-sourcemaps";
import _ from "lodash";
import path from "path";
import webpack from "webpack";

const ClientJSEntry = "./src/client/index.js";
const Dist = "dist/";
const ServiceWorkerEntry = "./src/client/service-worker.js";
const ClientJSWatchGlobs = ["src/client/**/*.js", "src/client/**/*.jsx"];
const ServiceWorkerWatchGlobs = ["dist/**/*", "!dist/service-worker.js"];
const StaticResourceGlobs = ["src/client/static/**/*.svg", "src/client/static/**/*.png"];
const TemplateHTMLPath = "src/client/template.html";
const WebManifestGlob = "src/client/static/app.webmanifest";

/**
 * @returns {Object}
 */
const getConfig = async () => Config.getConfig();

/**
 * @returns {Promise.<string>} - never has a trailing slash.
 */
const getServerPath = async () => {
  const config = await getConfig();
  return (config.serverPath || "/").replace(/\/*$/, "");  // replace trailing slashes
};

/**
 * Returns a stringified object containing selected environment properties.
 * @returns {string}
 */
export const getEnv = () => JSON.stringify(_.pick(process.env, "NODE_ENV"));

/* ********************************************** Client JS ******************************************************** */
const getWebPackConfig = async ({ app, serviceWorker }) => {
  const version = JSON.parse((await fs.readFile("./package.json")).toString()).version;
  const entry = {};
  if (app) {
    entry.app = ClientJSEntry;
  }

  if (serviceWorker) {
    entry["service-worker"] = ServiceWorkerEntry;
  }

  return {
    cache: { type: "filesystem" },
    mode: process.env.NODE_ENV || "development",
    entry,
    output: {
      path: path.resolve("./dist"),
      filename: "[name].js",
      publicPath: await getServerPath(),
    },
    // devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map",
    module: {
      rules: [{
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      }, {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "string-replace-loader",
          options: {
            multiple: [{
              search: "%%%SERVER_PATH%%%",
              replace: await getServerPath(),
            }],
          },
        },
      }],
    },
    resolve: { extensions: [".js", ".jsx"] },
    node: { fs: "empty" },
    plugins: [
      new webpack.DefinePlugin({
        version,
        buildTimeStamp: new Date().toISOString(),
      }),
      new webpack.BannerPlugin({
        entryOnly: true,
        banner: `v${version} Generated at ${new Date().toISOString()}.`,
      }), 
    ],
  };
};

const getCompiler = async ({ app, serviceWorker }) => {
  const wpConfig = await getWebPackConfig({ app, serviceWorker });
  console.log("WebPack Config:", wpConfig);
  const compiler = webpack(wpConfig);
  return compiler;
};

const getCompilerCallback = ({ app, reject, resolve }) =>
  async (err, stats) => {
    console.log("Compiler callback called...");
    if (err) {
      console.error("Error occurred - A", err);
      reject && reject(err);
    }

    if (stats.hasErrors()) {
      console.error("Error occurred - B");
      reject && reject(new Error(stats.compilation.errors.join("\n")));
    }

    console.log(stats.toString({ colors: true }));
    if (app) {
      const statsJSON = stats.toJson();
      await fs.writeFile("./webpack-stats.json", JSON.stringify(statsJSON, null, 2));
    }
    resolve && resolve();
  };

export const buildClientJS = async () => {
  const compiler = await getCompiler({ app: true });
  await new Promise((resolve, reject) => compiler.run(getCompilerCallback({ app: true, resolve, reject })));
};

export const watchClientJS = () => gulp.watch(ClientJSWatchGlobs, buildClientJS);

export const buildServiceWorker = async () => {
  console.trace("buildServiceWorker was invoked!!!");
  const compiler = await getCompiler({ serviceWorker: true });
  await new Promise((resolve, reject) => compiler.run(getCompilerCallback({ resolve, reject })));
};

export const watchServiceWorker = () => gulp.watch(ServiceWorkerWatchGlobs, buildServiceWorker);

/* *********************************************** Server ********************************************************** */
export const buildServer = async () => {
  console.log("Build the server");
  return gulp.src(["src/**/*.js", "src/**/*.ts", "src/**/*.jsx", "src/**/*.tsx"])
    .pipe(debug({ title: "[buildServer]" }))
    // .pipe(sourcemaps.init())
    .pipe(babel())
    .on("error", console.error.bind(console))
    // .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./app"));
};

/* ********************************************** Static *********************************************************** */
export const copyStatics = () =>
  gulp.src(StaticResourceGlobs)
    .pipe(gulp.dest(Dist));

export const generateIndexHTML = async () => {
  const serverPath = await getServerPath();
  gulp.src(TemplateHTMLPath)
    .pipe(replace("%%%SERVER_PATH%%%", serverPath))
    .pipe(rename("index.html"))
    .pipe(gulp.dest(Dist));
};

export const generateWebManifest = async () => {
  const serverPath = await getServerPath();
  return gulp.src(WebManifestGlob)
    .pipe(replace("%%%SERVER_PATH%%%", serverPath))
    .pipe(gulp.dest(Dist));
};

/* ****************************************** Put 'Em Together ***************************************************** */
export const buildClient = gulp.parallel(buildClientJS, copyStatics, generateIndexHTML, generateWebManifest);
export const build = gulp.series(buildServer, buildClient);
export const watch = gulp.parallel(watchClientJS, watchServiceWorker);
export const dev = gulp.series(build, watch);

export const clean = () => del(Dist);
