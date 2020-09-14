import { Item } from "./model/Item";

export enum Event {
  ItemAdded = "ItemAdded",
  ItemRemoved = "ItemRemoved",
  ItemUpdated = "ItemUpdated",
  YTDLUpgradeSucceeded = "YTDLUpgradeSucceeded",
  YTDLUpgradeFailed = "YTDLUpgradeFailed",
}

export interface ItemUpdatedPayload {
  item: Item,
  previous: Item,
}
