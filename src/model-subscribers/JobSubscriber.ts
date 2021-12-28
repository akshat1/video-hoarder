import { Job, JobStatus } from "../model/Job";
import { Topic } from "../model/Topic";
import { getPubSub } from "../server/pubsub";
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from "typeorm";

@EventSubscriber()
export class JobSubscriber implements EntitySubscriberInterface<Job> {
  listenTo(): Function|string {
    return Job;
  }

  afterInsert(event: InsertEvent<Job>): void {
    const job = event.entity;
    if (job.status === JobStatus.Pending) {
      console.log("Added pending job");
      getPubSub().publish(Topic.JobAdded, job);
    }
  }

  afterUpdate(event: UpdateEvent<Job>): void {
    const job = event.databaseEntity;
    getPubSub().publish(Topic.JobUpdated, job);
  }
  
  beforeRemove(event: RemoveEvent<Job>): void {
    const job = event.entity;
    getPubSub().publish(Topic.JobRemoved, job);
  }
}
