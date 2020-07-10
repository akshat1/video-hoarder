import babelify from "babelify";
import browserify from "browserify";
import browserifyInc from "browserify-incremental";
import del from "del";
import fg from "fast-glob";
import { promises as fs } from "fs";
import gulp from "gulp";
import rename from "gulp-rename";
import replace from "gulp-replace";
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
const getConfig = async () => {
  if (!config) {
    config = JSON.parse((await fs.readFile("config.json")).toString());
  }

  return config;
}

/* ********************************************** Client JS ******************************************************** */
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
}

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
    .pipe(gulp.dest(Dist));
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
    .pipe(replace("const CacheMap = {}; // DO NOT CHANGE THIS LINE. MARKER FOR GULP-REPLACE.", `const CacheMap = ${strCacheKeys}`))
    .pipe(gulp.dest(Dist));
};

export const clientJSWatch = () => gulp.watch(JSClientSrcGlobs, buildClientJS);
export const serviceworkerWatch = () => gulp.watch(ServiceWorkerWatchGlob, buildServiceWorker);
export const watch = gulp.parallel(clientJSWatch, serviceworkerWatch);

/* ********************************************** Static *********************************************************** */
export const copyStatics = () =>
  gulp.src(StaticResourceGlobs)
    .pipe(gulp.dest(Dist));

/**
 * @returns {Promise.<string>} - never has a trailing slash.
 */
const getServerPath = async () => {
  const config = await getConfig();
  return (config.serverPath || "/").replace(/\/*$/, "");  // replace trailing slashes
};

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
export const build = gulp.series(buildClient, buildServiceWorker);

export const clean = () => del(Dist);
