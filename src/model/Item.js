/**
 * @module model/Item
 */

import { Status } from "../Status.js";
import md5 from "blueimp-md5";

/**
 * @typedef {Object} ItemMetadata
 */

/**
 * @typedef Item
 * @property {ItemMetadata} metadata
 * @property {Status} status
 * @property {string} addedBy - username of the user
 * @property {string} errorMessage
 * @property {string} id
 * @property {string} url
 * @property {TimeStamp} addedAt
 * @property {TimeStamp} updatedAt
 */

export const makeItem = (args) => {
  const {
    addedBy,
    url,
  } = args;

  const currentTime = new Date();
  const addedAt = currentTime.toISOString();

  return {
    addedAt,
    addedBy,
    id: md5(`${url}-${currentTime.getTime()}`),
    metadata: null,
    status: Status.Pending,
    updatedAt: addedAt,
    url,
  };
};

/**
 * 
 * @param {Item} item 
 * @returns {string} - video title, or URL (as a fallback).
 */
export const getTitle = item => (item.metadata && item.metadata.title) || item.url;

/**
 * 
 * @param {Item} item 
 * @returns {string} - thumbnail URL or null.
 */
export const getThumbnail = item => (item.metadata && item.metadata.thumbnail) || null;
