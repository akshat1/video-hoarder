import babelify from "babelify";
import browserify from "browserify";
import browserifyInc from "browserify-incremental";
import del from "del";
import fg from "fast-glob";
import { promises as fs } from "fs";
import gulp from "gulp";
import rename from "gulp-rename";
import replace from "gulp-replace";
import _ from "lodash";
import source from "vinyl-source-stream";

const BrowserifyIncCachePath = "./browserify-cache.json";
const ClientJSEntry = "./src/client/index.js";
const Dist = "dist/";
const JSBundleName = "app.js";
const JSClientSrcGlobs = ["src/client/**/*.js", "src/client/**/*.jsx"];
const JSExtensions = [".jsx", ".js"];
const ServiceWorkerEntry = "./src/client/service-worker.js";
const ServiceWorkerName = "service-worker.js";
const ServiceWorkerWatchGlob = ["dist/**/*", "!dist/service-worker.js"];
const StaticResourceGlobs = ["src/client/static/**/*.svg", "src/client/static/**/*.png"];
const TemplateHTMLPath = "src/client/template.html";
const WebManifestGlob = "src/client/static/app.webmanifest";

let config;
/**
 * @returns {Object}
 */
const getConfig = async () => {
  if (!config) {
    config = JSON.parse((await fs.readFile("config.json")).toString());
  }

  return config;
};

/**
 * @returns {Promise.<string>} - never has a trailing slash.
 */
const getProxiedPath = async () => {
  const config = await getConfig();
  return (config.proxiedPath || "/").replace(/\/*$/, "");  // replace trailing slashes
};

/**
 * Returns a stringified object containing selected environment properties.
 * @returns {string}
 */
export const getEnv = () => JSON.stringify(_.pick(process.env, "NODE_ENV"));

/* ********************************************** Client JS ******************************************************** */
export const buildClientJS = () => {
  const b = browserify({
    cache: {},
    debug: true,
    entries: ClientJSEntry,
    extensions: JSExtensions,
    fullPaths: true,
    packageCache: {},
  });

  return browserifyInc(b, { cacheFile: BrowserifyIncCachePath })
    .transform(babelify)
    .bundle()
    // .pipe(minify())
    .pipe(source(JSBundleName))
    .pipe(replace("const __gulp__env = {};", `const __gulp__env = ${getEnv()};`))
    .pipe(gulp.dest(Dist));
};

/**
 * @returns {Promise.<Object.<string, string>>}
 */
const getCacheKeys = async () => {
  const entries = await fg(ServiceWorkerWatchGlob, { stats:  true, onlyFiles: true });
  const dict = {};
  for (let entry of entries) {
    if (entry.name !== "service-worker.js")
      dict[entry.name] = entry.stats.mtime;
  }
  return dict;
};

export const buildServiceWorker = async () => {
  const b = browserify({
    cache: {},
    debug: true,
    entries: ServiceWorkerEntry,
    extensions: JSExtensions,
    fullPaths: true,
    packageCache: {},
  });

  const cacheKeys = await getCacheKeys();
  console.log("cacheKeys:", cacheKeys);
  const strCacheKeys = JSON.stringify(cacheKeys);
  return browserifyInc(b, { cacheFile: BrowserifyIncCachePath })
    .transform(babelify)
    .bundle()
    .pipe(source(ServiceWorkerName))
    .pipe(replace("const CacheMap = {};", `const CacheMap = ${strCacheKeys};`))
    .pipe(replace("const __gulp__env = {};", `const __gulp__env = ${getEnv()};`))
    .pipe(gulp.dest(Dist));
};

export const clientJSWatch = () => gulp.watch(JSClientSrcGlobs, buildClientJS);
export const serviceworkerWatch = () => gulp.watch(ServiceWorkerWatchGlob, buildServiceWorker);
export const watch = gulp.parallel(clientJSWatch, serviceworkerWatch);

/* ********************************************** Static *********************************************************** */
export const copyStatics = () =>
  gulp.src(StaticResourceGlobs)
    .pipe(gulp.dest(Dist));

export const generateIndexHTML = async () => {
  const serverPath = await getProxiedPath();
  gulp.src(TemplateHTMLPath)
    .pipe(replace("%%%SERVER_PATH%%%", serverPath))
    .pipe(rename("index.html"))
    .pipe(gulp.dest(Dist));
};

export const generateWebManifest = async () => {
  const serverPath = await getProxiedPath();
  return gulp.src(WebManifestGlob)
    .pipe(replace("%%%SERVER_PATH%%%", serverPath))
    .pipe(gulp.dest(Dist));
};

/* ****************************************** Put 'Em Together ***************************************************** */
export const buildClient = gulp.parallel(buildClientJS, copyStatics, generateIndexHTML, generateWebManifest);
export const build = gulp.series(buildClient, buildServiceWorker);

export const clean = () => del(Dist);
