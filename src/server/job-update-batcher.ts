/**
 * This module listens for Topic.JobUpdatedInternal and accumulates job updates in a map.
 * Periodically, this buffer is drained and the updates are sent to the client via
 * Topics.JobUpdated event.
 * 
 * We use a map for accumulating updates because we want to send the latest update for every job.
 */
import { Job } from "../model/Job";
import { Topic } from "../model/Topic";
import { getLogger } from "../shared/logger";
import { getPubSub } from "./pubsub";

const rootLogger = getLogger("job-update-batcher");
const buffer:Map<string, Job> = new Map();

/**
 * Listener for the Topic.JobUpdatedInternal event. This is where we update our buffer.
 */
const onJobUpdated = (job: Job): void => {
  // We want to retain the latest message for the job and discard older ones.
  buffer.delete(job.id);
  buffer.set(job.id, job);
};
getPubSub().subscribe(Topic.JobUpdatedInternal, onJobUpdated, {});

const ncLogger = getLogger("notifyClient", rootLogger);
/**
 * This function is executed periodically. This is where we flush the buffer and send all updates
 * to client.
 * 
 * Note: We actually only emit the Topic.JobUpdated event here. The actual "send to client" bit
 * happens through the `jobUpdated` subscription in JobResolver.
 */
const notifyClient = (): void => {
  if (buffer.size) {
    ncLogger.debug("notify clients");
    const entries = Array.from(buffer.values());
    buffer.clear();
    getPubSub().publish(Topic.JobUpdated, entries);
  }
  setTimeout(notifyClient, 1000);  // once every second.
};
notifyClient();
