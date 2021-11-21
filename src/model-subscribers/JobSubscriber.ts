import { Job } from "../model/Job";
import { Topic } from "../model/Topic";
import { getPubSub } from "../server/pubsub";
import { addJobToQueue, removeJobFromQueue } from "../server/YTQueue";
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from "typeorm";

@EventSubscriber()
export class JobSubscriber implements EntitySubscriberInterface<Job> {
  listenTo(): Function|string {
    return Job;
  }

  afterInsert(event: InsertEvent<Job>): void {
    const job = event.entity;
    console.log("Adding job to queue", job.url);
    addJobToQueue(job);
    getPubSub().publish(Topic.JobAdded, job);
  }

  afterUpdate(event: UpdateEvent<Job>): void {
    const job = event.entity;
    getPubSub().publish(Topic.JobUpdated, job);
  }

  afterRemove(event: RemoveEvent<Job>): void {
    const job = event.entity;
    console.log("Job removed", job.url);
    getPubSub().publish(Topic.JobRemoved, job);
    removeJobFromQueue(job);
  }
}
