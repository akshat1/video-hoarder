import { Status } from "../model/Status";
import { Entity } from "./Entity";
import md5 from "blueimp-md5";

const System = "System";

export interface ItemMetadata {
  description: string,
  thumbnail: string,
  title: string,
}

export interface Item extends Entity {
  errorMessage?: string,
  metadata: ItemMetadata,
  status: Status,
  url: string,
}

export const makeItem = (args: { createdBy: string, url: string}): Item => {
  const {
    createdBy,
    url,
  } = args;

  const currentTime = new Date();
  const createdAt = currentTime.toISOString();
  return {
    createdAt,
    createdBy,
    id: md5(`${url}-${currentTime.getTime()}`),
    metadata: null,
    status: Status.Pending,
    updatedAt: createdAt,
    updatedBy: createdBy,
    url,
  };
};

// Accessors
export const getTitle = (item: Item): string => item?.metadata?.title || item.url;

export const getThumbnail = (item: Item): string => item?.metadata?.thumbnail || null;

export const getDescription = (item: Item): string => item?.metadata?.description || "";

// Mutators

/**
 * Sets the status to Failed.
 */
export const markItemFailed = (args: { errorMessage: string, item: Item }): Item => {
  const { errorMessage, item } = args;
  return {
    ...item,
    errorMessage,
    status: Status.Failed,
    updatedAt: new Date().toISOString(),
    updatedBy: System,
  };
};

/**
 * Sets the status to Canceled (a particular failure mode with an associated user).
 */
export const markItemCanceled = (args: { item: Item, updatedBy: string }): Item => {
  const { item, updatedBy } = args;
  return {
      ...item,
    errorMessage: "Canceled",
    status: Status.Failed,
    updatedAt: new Date().toISOString(),
    updatedBy,
  }
};

/**
 * Sets the status to Succesful.
 * @returns a new Item object with the updated status.
 */
export const markItemSuccessful = (item:Item): Item => ({
  ...item,
  status: Status.Succeeded,
  updatedAt: new Date().toISOString(),
  updatedBy: System,
});

/**
 * Sets the status to InProgress.
 * @returns a new Item object with the updated status.
 */
export const markItemInProgress = (item: Item): Item => ({
  ...item,
  status: Status.Running,
  updatedAt: new Date().toISOString(),
  updatedBy: System,
});

/**
 * Sets Metadata.
 * @returns a new Item object with the updated metadata.
 */
export const setMetadata = (args: { item, metadata }): Item => {
  const { item, metadata } = args;
  return {
    ...item,
    updatedAt: new Date().toISOString(),
    metadata,
  };
};
