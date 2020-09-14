const Config = require("./src/server/config.js");
const del = require("del");
const fs = require("fs").promises;
const gulp = require("gulp");
const babel = require("gulp-babel");
const debug = require("gulp-debug");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const sourcemaps = require("gulp-sourcemaps");
const _ = require("lodash");
const path = require("path");
const webpack = require("webpack");

const ClientJSEntry = "./app/client/index.js";
const Dist = "dist/";
const ServiceWorkerEntry = "./app/client/service-worker.js";
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
module.exports.getEnv = () => JSON.stringify(_.pick(process.env, "NODE_ENV"));

const transpile = module.exports.transpile = () =>
  gulp.src(["src/**/*.js", "src/**/*.ts", "src/**/*.jsx", "src/**/*.tsx"])
    .pipe(debug({ title: "[buildServer]" }))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on("error", console.error.bind(console))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./app"));

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

const buildClientJS = module.exports.buildClientJS = async () => {
  const compiler = await getCompiler({ app: true });
  await new Promise((resolve, reject) => compiler.run(getCompilerCallback({ app: true, resolve, reject })));
};

const buildServiceWorker = module.exports.buildServiceWorker = async function buildServiceWorker () {
  console.trace("buildServiceWorker was invoked!!!");
  const compiler = await getCompiler({ serviceWorker: true });
  return new Promise((resolve, reject) => compiler.run(getCompilerCallback({ resolve, reject })));
};

/* ********************************************** Static *********************************************************** */
const copyStatics = module.exports.copyStatics = () =>
  gulp.src(StaticResourceGlobs)
    .pipe(gulp.dest(Dist));

const generateIndexHTML = module.exports.generateIndexHTML = async () => {
  const serverPath = await getServerPath();
  return gulp.src(TemplateHTMLPath)
    .pipe(replace("%%%SERVER_PATH%%%", serverPath))
    .pipe(rename("index.html"))
    .pipe(gulp.dest(Dist));
};

const generateWebManifest = module.exports.generateWebManifest = async () => {
  const serverPath = await getServerPath();
  return gulp.src(WebManifestGlob)
    .pipe(replace("%%%SERVER_PATH%%%", serverPath))
    .pipe(gulp.dest(Dist));
};

/* ****************************************** Put 'Em Together ***************************************************** */
const buildClient = module.exports.buildClient = gulp.series(
  gulp.parallel(buildClientJS, copyStatics, generateIndexHTML, generateWebManifest),
  buildServiceWorker,
);
const build = module.exports.build = gulp.series(transpile, buildClient);
module.exports.dev = gulp.series(build);
module.exports.clean = () => del([Dist, "app", "db-data"]);
