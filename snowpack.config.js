module.exports = {
  mount: {
    "src/client/": {url: "/" },
    "src/model": { url: "/model/" },
  },
  exclude: [
    "**/node_modules/**/*",
    "**/server/**/*",
  ],
  routes: [{
    match: "routes",
    src: ".*",
    dest: "/index.html",
  }],
  plugins: [ 
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-typescript", // TS support
  ],
  optimize: {
    bundle: true,
    minify: true,
    target: "es2020",
    treeshake: true,
    manifest: true,
  },
  alias: {
    "type-graphql": "type-graphql/dist/browser-shim.js",
    "typeorm": "typeorm/typeorm-class-transformer-shim.js",
  },
};
