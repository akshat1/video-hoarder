import { TimeStamp } from "./TimeStamp";

export interface Entity {
  id: string,
  createdAt: TimeStamp,
  createdBy: string,
  updatedAt: TimeStamp,
  updatedBy: string,
}
