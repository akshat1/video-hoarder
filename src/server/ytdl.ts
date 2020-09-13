import { Event, ItemUpdatedPayload } from "../Event";
import { getLogger } from "../logger";
import { Item,markItemInProgress } from "../model/Item";
import { Status } from "../model/Status";
import { addMetadata, completeJob, failJob, getJobs, toArray } from "./db/index";
import * as EventBus from "./event-bus";
import { execFile } from "child_process";
import { promises as fs } from "fs";
import PQueue from "p-queue";
import path from "path";

const rootLogger = getLogger("ytdl");
const VideoConcurrency = 5;
const MetadataConcurrency = 10;

let metadataQ;
let videoQ;

/**
 * Downloads video metadata from youtube. Emits various bus-events along the way.
 */
const downloadMeta = (item: Item): Promise<any> => {
  const logger = getLogger("downloadMeta", rootLogger);
  logger.debug("begin", item);
  const args = [
    "-s",
    "--print-json",
    item.url,
  ];
  logger.debug("youtube-dl args", args);
  return new Promise((resolve, reject) => {
    let subProcess;  // eslint-disable-line prefer-const
    const itemCancelHandler = (args: ItemUpdatedPayload) => {
      const { id, status } = args.item;
      const logger2 = getLogger(`itemCancelHandler-${id}`, logger);
      logger2.debug("Cancel", item)
      if (id === item.id && status === Status.Failed) {
        logger2.debug("item failed");
        // perhaps the item was cancelled?
        if (subProcess && !subProcess.killed) {
          logger2.debug("Killing the youtube-dl process.");
          subProcess.kill();
          logger2.debug("YouTube-dl killed");
        }

        logger.debug("Stop listening for event");
        EventBus.unsubscribe(Event.ItemUpdated, itemCancelHandler);
      }
    };

    subProcess = execFile("youtube-dl", args, {}, (error: Error, stdout: Buffer, stderr: Buffer) => {
      const logger2 = getLogger(`execFileCallback-${item.id}`, logger);
      EventBus.unsubscribe(Event.ItemUpdated, itemCancelHandler);
      if (error) {
        logger2.error("Error obtaining metadata. stderr:", stderr.toString());
        const metadata = {
          title: item.url,
        };
        logger2.debug("Obtained metadata");
        resolve(addMetadata({ item, metadata }));
        // reject(error);
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
    logger.error("metadata download encountered an error", { url: item.url, error });
    failJob({ item, errorMessage: error.message });
  });
};

interface ConfigThunk {
  pathName: string,
  cleanUp: () => Promise<any>,
}

const getGlobalConfigFilePath = (): string => path.resolve(process.cwd(), "./youtube-dl.conf");
export const getGlobalConfig = async (): Promise<string> => (await fs.readFile(getGlobalConfigFilePath())).toString();
export const writeGlobalConfig = async (configurationText: string): Promise<void> => await fs.writeFile(getGlobalConfigFilePath(), configurationText);

/**
 * Create a config file for _this_ download.
 */
const getConfig = async (item: Item): Promise<ConfigThunk> => {
  const logger = getLogger("getConfig");
  logger.debug("get config for", item.url);
  await fs.mkdir(path.join(process.cwd(), "tmp"), { recursive: true });
  // for now, everything just gets the base youtube-dl config. At some point we will start customising per download.
  const config = await getGlobalConfig();
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
 */
const downloadVideo = async (item: Item): Promise<any> => {
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
    item.url,
  ];
  logger.debug("download args", args);
  return new Promise((resolve, reject) => {
    let subProcess;  // eslint-disable-line
    const itemCancelHandler = (args: ItemUpdatedPayload) => {
      const { id, status } = args.item;
      if (id === item.id && status === Status.Failed) {
        // perhaps the item was cancelled?
        if (!subProcess.killed) {
          subProcess.kill();
        }

        EventBus.unsubscribe(Event.ItemUpdated, itemCancelHandler);
      }
    };

    const previous = item;
    item = markItemInProgress(item);
    EventBus.emit(Event.ItemUpdated, {
      previous,
      item,
    });

    logger.debug("Start download process...");
    subProcess = execFile("youtube-dl", args, {}, (error: Error, stdout: Buffer, stderr: Buffer) => {
      const logger2 = getLogger(`execFileCallback ${item.id}`, logger);
      EventBus.unsubscribe(Event.ItemUpdated, itemCancelHandler);
      if (error) {
        logger2.error("stderr:", stderr.toString());
        reject(error);
      } else {
        logger2.debug("download complete");
        resolve(completeJob(item));
      }
    });

    const logger2 = getLogger("subprocess", logger);
    subProcess.stdout.on("data", data => logger2.debug(data));
    EventBus.subscribe(Event.ItemUpdated, itemCancelHandler);
  })
  .catch((error) => {
    logger.error("video download encountered an error", { url: item.url, error });
    failJob({ item, errorMessage: error.message });
  })
  .finally(() => {
    return configThunk.cleanUp();
  });
};

export const initializeYTDL = async (): Promise<void> => {
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
    },
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
    },
  }));
  logger.debug("videoJobs", videoJobs);
  videoJobs.forEach(item => videoQ.add(() => downloadVideo(item)));

  EventBus.subscribe(Event.ItemAdded, (item) => {
    logger.debug("ItemAdded", item);
    metadataQ.add(() => downloadMeta(item));
  });

  EventBus.subscribe(Event.ItemUpdated, ({ item, previous }) => {
    logger.debug("ItemUpdated", { previous, item });
    if (!previous.metadata && item.metadata && (item.status === Status.Pending)) {
      logger.debug("Add to videoQ", item);
      videoQ.add(() => downloadVideo(item));
    }
  });
};
