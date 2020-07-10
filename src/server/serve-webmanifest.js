import { getConfigValue } from "./config.js";
import { promises as fs } from "fs";

const generateWebManifest = async () => {
  const strManifest = await fs.readFile("src/client/static/app.webmanifest").toString();
  return {
    ...JSON.parse(strManifest),
    start_url: getConfigValue("serverPath"),
  };
};

export const serveWebManifest = async (req, res, next) => {
  try {
    res.send(await generateWebManifest());
  } catch (error) {
    next(error);
  }
};
