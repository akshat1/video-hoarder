import _ from "lodash";

const DefaultConfig = {
  serverPath: "/",
  https: false,
  serverPort: 7200,
};
let FinalConfig;

export const loadConfig = async () => {
  let loadedConfig = {};
  try {
    if (typeof window === "undefined") {
      const path = await import("path");
      const fs = await import("fs");  // Webpack replaces this with _.identity in the bundle.
      const buffer = await fs.promises.readFile(path.join(process.cwd(), "config.json"));
      loadedConfig = JSON.parse(buffer.toString());
    } else {
      loadedConfig = await import("../config.json");
    }
  } catch (err) {
    console.error(err);
  }

  return {
    ...DefaultConfig,
    ...loadedConfig,
  };
};

export const getConfig = async () => {
  if (!FinalConfig) {
    FinalConfig = await loadConfig();
  }

  return FinalConfig;
};

export const getConfigValue = async keyPath => _.get(await getConfig(), keyPath);
