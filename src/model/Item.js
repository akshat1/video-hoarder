/**
 * @module model/Item
 */

import { Status } from "../Status.js";
import md5 from "blueimp-md5";

/**
 * @typedef Item
 * @property {Status} status
 * @property {string} addedBy - username of the user
 * @property {string} description
 * @property {string} id
 * @property {string} thumbnail
 * @property {string} title
 * @property {string} url
 * @property {TimeStamp} addedAt
 * @property {TimeStamp} updatedAt
 */

export const makeItem = (args) => {
  const {
    url,
    addedBy,
  } = args;

  const currentTime = new Date();
  const addedAt = currentTime.toISOString();

  return {
    addedAt,
    addedBy,
    description: null,
    id: md5(`${url}-${currentTime.getTime()}`),
    thumbnail: null,
    title: null,
    status: Status.Pending,
    updatedAt: addedAt,
    url,
  };
};
