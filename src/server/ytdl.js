/* eslint-disable no-unused-vars */
import { Event } from "../Event.js";
import { getLogger } from "../logger.js";
import { Status } from "../Status.js";
import { addMetadata,failJob, getJobs,toArray } from "./db/index.js";
import * as EventBus from "./event-bus.js";
import { execFile } from "child_process";
import PQPkg from "p-queue"; // because JS absolutely NEEDED packages; require just wasn't good enough for us. Just like a fish needs a bicycle.

const { default: PQueue } = PQPkg; // I. uh. whatever. Packages. with magic symbols. Yay woo.

const rootLogger = getLogger("ytdl");
const videoConcurrency = 5;
const metadataConcurrency = 10;

let metadataQ;
// let videoQ;

/**
 * Downloads video metadaya from youtube. Emits various bus-events along the way.
 * @param {Item}
 */
const downloadMeta = (item) => {
  const logger = getLogger("downloadMeta", rootLogger);
  logger.debug("downloadMeta", item);
  const args = [
    "-s",
    "--print-json",
    item.url,
  ];
  logger.debug("youtube-dl args", args);
  const opts = { detached: true };
  return new Promise((resolve, reject) => {
    execFile("youtube-dl", args, opts, (error, stdout, stderr) => {
      const logger2 = getLogger("execFileCallback", logger);
      if (error) {
        reject(error);
      } else {
        try {
          const strMeta = stdout.toString();
          logger2.debug(strMeta);
          const metadata = JSON.parse(strMeta);
          logger.debug(metadata);
          resolve(addMetadata({ item, metadata }));
        } catch(error) {
          reject(error);
        }
      }
    });
  }).catch((error) => {
    logger.error({ url: item.url, error });
    failJob({ item, errorMessage: error.message });
  });
};

/**
 * Downloads the video from youtube. Emits various bus-events along the way.
 * @param {Item}
 */
const downloadVideoFromYouTube = async () => Promise.resolve(0);

// TODO: Import and call init() from server startup routine.
export const initializeYTDL = async () => {
  const logger = getLogger("initializeYTDL", rootLogger);
  // videoQ = new PQueue({ concurrency: videoConcurrency });
  metadataQ = new PQueue({ concurrency: metadataConcurrency });

  // Pick up any pending tasks in the db (this includes tasks which were running when we exited).
  const pendingJobs = await toArray(await getJobs({
    status: {
      $in: [Status.Pending, Status.Running],
    }
  }));
  logger.debug("Pending jobs", pendingJobs);
  pendingJobs.forEach(item => {
    if(!item.metadata)  // We filter for metadata here (and not in the query) because we will use the same list for the videoQ as well.
      metadataQ.add(() => downloadMeta(item))
  });

  EventBus.subscribe(Event.ItemAdded, (item) => {
    logger.debug("ItemAdded", item);
    metadataQ.add(() => downloadMeta(item));
    // const videoPromise = downloadVideoFromYouTube();
    // videoQ.add(videoPromise);
  });
};
