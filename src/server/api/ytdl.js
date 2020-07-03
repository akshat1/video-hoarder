import { Event } from "../../Event.js";
import { getLogger } from "../../logger.js";
import * as EventBus from "../event-bus.js";
import { getGlobalConfig as getGlobalYTDLConfig, writeGlobalConfig } from "../ytdl.js";
import { execFile } from "child_process";
import express from "express";
import { ensureAdminUser } from "../express-middleware/index.js";

const { Router } = express;
const rootLogger = getLogger("api/ytdl");

const getBinaryPath = () =>
  new Promise((resolve, reject) => {
    execFile("which", ["youtube-dl"], {}, (error, stdout, stderr) => {
      const logger = getLogger("getBinaryPath", rootLogger);
      if (error) {
        logger.error({ 
          error,
          stdErr: stderr.toString(),
        });
        reject(error);
      } else {
        logger.debug("which youtube-dl succeeded");
        resolve(stdout.toString().replace(/\n$/, ""));
      }
    });
  });

const getBinaryVersion = () =>
  new Promise((resolve, reject) => {
    execFile("youtube-dl", ["--version"], {}, (error, stdout, stderr) => {
      const logger = getLogger("getBinaryVersion", rootLogger);
      if (error) {
        logger.error({ 
          error,
          stdErr: stderr.toString(),
        });
        reject(error);
      } else {
        logger.debug("youtube-dl --version succeeded");
        resolve(stdout.replace(/\n$/, ""));
      }
    });
  });

const getYTDLInformation = async () => ({
  binaryPath: await getBinaryPath(),
  binaryVersion: await getBinaryVersion(),
  globalConfig: await getGlobalYTDLConfig(),
});

export const getInformation = async (req, res, next) => {
  const logger = getLogger("getInformation", rootLogger);
  logger.debug("Get binary path");
  try {
    res.send(await getYTDLInformation());
  } catch (error) {
    logger.error(error);
    res.status(500).send("SERVER ERROR");
    next(error);
  }
};

// This call always succeeds, failure and success are indicated via the socket
export const installLatestVersion = (req, res) => {
  const logger = getLogger("installLatestVersion", rootLogger);
  execFile("youtube-dl", ["-U"], {}, async (error, stdout, stderr) => {
    if (error) {
      logger.error({ 
        error,
        stdErr: stderr.toString(),
      });
      // res.status(500).send(error);
      EventBus.emit(Event.YTDLUpgradeFailed, error);
    } else {
      logger.debug("youtube-dl -U succeeded");
      EventBus.emit(Event.YTDLUpgradeSucceeded, await getYTDLInformation());
    }
  });
  return res.send("OK");
};

export const updateGlobalConfig = async (req, res, next) => {
  const logger = getLogger("updateGlobalConfig", rootLogger);
  const { newConfiguration } = req.body;
  try {
    await writeGlobalConfig(newConfiguration);
    res.send("OK");
  } catch (error) {
    logger.error(error);
    res.status(500).send("SERVER ERROR");
    next(error);
  }
};

export const getRouter = () => {
  const router = new Router();

  router.get("/information", getInformation);
  router.post("/upgrade", installLatestVersion);
  router.put("/global-config", ensureAdminUser, updateGlobalConfig);
  return router;
};
