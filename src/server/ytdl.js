import { Event } from "../Event.js";
import { getLogger } from "../logger.js";
import { Status } from "../Status.js";
import { addMetadata,completeJob,failJob, getJobs,toArray } from "./db/index.js";
import * as EventBus from "./event-bus.js";
import { execFile } from "child_process";
import { promises as fs } from "fs";
import PQPkg from "p-queue"; // because JS absolutely NEEDED packages; require just wasn't good enough for us. Just like a fish needs a bicycle.
import path from "path";

const { default: PQueue } = PQPkg; // I. uh. whatever. Packages. with magic symbols. Yay woo.

const rootLogger = getLogger("ytdl");
const VideoConcurrency = 5;
const MetadataConcurrency = 10;

let metadataQ;
let videoQ;

/**
 * Downloads video metadata from youtube. Emits various bus-events along the way.
 * @param {Item}
 * @returns {Promise}
 */
const downloadMeta = (item) => {
  const logger = getLogger("downloadMeta", rootLogger);
  logger.debug("begin", item);
  const args = [
    "-s",
    "--print-json",
    item.url,
  ];
  logger.debug("youtube-dl args", args);
  const opts = { detached: true };
  return new Promise((resolve, reject) => {
    let subProcess;
    const itemCancelHandler = ({ id, status }) => {
      const logger2 = getLogger(`itemCancelHandler-${id}`, logger);
      if (id === item.id && status === Status.Failed) {
        logger2.debug("item failed");
        // perhaps the item was cancelled?
        if (subProcess && !subProcess.killed) {
          logger2.debug("Killing the youtube-dl process.");
          subProcess.kill();
          logger.debug("YouTube-dl killed");
        }

        EventBus.unsubscribe(Event.ItemUpdated, itemCancelHandler);
      }
    };

    subProcess = execFile("youtube-dl", args, opts, (error, stdout, stderr) => {
      const logger2 = getLogger(`execFileCallback-${item.id}`, logger);
      EventBus.unsubscribe(Event.ItemUpdated, itemCancelHandler);
      if (error) {
        logger2.error("stderr:", stderr.toString());
        reject(error);
      } else {
        try {
          const strMeta = stdout.toString();
          const metadata = JSON.parse(strMeta);
          logger2.debug("Obtained metadata");
          resolve(addMetadata({ item, metadata }));
        } catch(error) {
          reject(error);
        }
      }
    });
    EventBus.subscribe(Event.ItemUpdated, itemCancelHandler);
  }).catch((error) => {
    logger.error({ url: item.url, error });
    failJob({ item, errorMessage: error.message });
  });
};

/**
 * @typedef ConfigThunk
 * @property {string} pathName - path to youtibe-dl config file for this download.
 * @property {function} cleanUp - call after download is concluded (successfully or otherwise) to delete the temp config file.
 */

/**
 * Create a config file for _this_ download.
 * @param {Item} item
 * @returns {Promise<ConfigThunk>}
 */
const getConfig = async (item) => {
  const logger = getLogger("getConfig");
  logger.debug("get config for", item.url);
  await fs.mkdir(path.join(process.cwd(), "tmp"), { recursive: true });
  // for now, everything just gets the base youtube-dl config. At some point we will start customising per download.
  const config = (await fs.readFile(path.resolve(process.cwd(), "./youtube-dl.conf"))).toString();
  const pathName = path.join(process.cwd(), "tmp", `${item.id}.conf`);
  await fs.writeFile(pathName, config);
  return {
    pathName,
    cleanUp: () => {
      logger.debug("clean-up");
      return fs.unlink(pathName);
    },
  };
};

/**
 * Downloads the video from youtube. Emits various bus-events along the way.
 * @param {Item}
 * @returns {Promise}
 */
const downloadVideo = async (item) => {
  const logger = getLogger("downloadVideo", rootLogger);
  logger.debug("begin", item);
  if (!item.metadata) {
    logger.warn("metadata not found. bail.");
    return;
  }

  const configThunk = await getConfig(item);
  const args = [
    "--config-location",
    configThunk.pathName,
    item.url
  ];
  logger.debug("download args", args);

  const opts = { detached: true };

  return new Promise((resolve, reject) => {
    let subProcess;
    const itemCancelHandler = ({ id, status }) => {
      if (id === item.id && status === Status.Failed) {
        // perhaps the item was cancelled?
        if (!subProcess.killed) {
          subProcess.kill();
        }

        EventBus.unsubscribe(Event.ItemUpdated, itemCancelHandler);
      }
    };

    subProcess = execFile("youtube-dl", args, opts, (error, stdout, stderr) => {
      const logger2 = getLogger("execFileCallback", logger);
      EventBus.unsubscribe(Event.ItemUpdated, itemCancelHandler);
      if (error) {
        logger2.error("stderr:", stderr.toString());
        reject(error);
      } else {
        resolve(completeJob(item));
      }
    });

    EventBus.subscribe(Event.ItemUpdated, itemCancelHandler);
  }).finally(() => {
    return configThunk.cleanUp();
  });
};

// TODO: Import and call init() from server startup routine.
export const initializeYTDL = async () => {
  const logger = getLogger("initializeYTDL", rootLogger);
  metadataQ = new PQueue({ concurrency: MetadataConcurrency });
  videoQ = new PQueue({ concurrency: VideoConcurrency });

  // Pick up any pending tasks in the db (this includes tasks which were running when we exited).
  const metadataJobs = await toArray(await getJobs({
    status: {
      $in: [Status.Pending, Status.Running],
    },
    metadata: {
      $eq: null,
    }
  }));
  logger.debug("metadataJobs", metadataJobs);
  metadataJobs.forEach(item => metadataQ.add(() => downloadMeta(item)));

  const videoJobs = await toArray(await getJobs({
    status: {
      $in: [Status.Pending, Status.Running],
    },
    metadata: {
      $exists: true,
      $ne: null,
    }
  }));
  logger.debug("videoJobs", videoJobs);
  videoJobs.forEach(item => videoQ.add(() => downloadVideo(item)));

  EventBus.subscribe(Event.ItemAdded, (item) => {
    logger.debug("ItemAdded", item);
    metadataQ.add(() => downloadMeta(item));
  });

  // This might become a problem if we ever update an item while it is already being downloaded; we might need a flag to indicate exactly whats's happening with an item.
  EventBus.subscribe(Event.ItemUpdated, (item) => {
    logger.debug("ItemUpdated", item);
    if (item.status === Status.Pending || item.status === Status.Running) {
      if (item.metadata) {
        logger.debug("Add to videoQ", item);
        videoQ.add(() => downloadVideo(item));
      }
    }
  });
};
