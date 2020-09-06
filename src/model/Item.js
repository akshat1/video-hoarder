/**
 * @module model/Item
 * @todo Make sure all mutators expect a username for updatedBy field.
 */

import { Status } from "../Status";
import md5 from "blueimp-md5";
import PropTypes from "prop-types";

const System = "System";

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
 * @property {string} updatedBy - username of the user who last updated this item.
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
    updatedBy: addedBy,
    url,
  };
};

export const ItemMetadataShape = PropTypes.shape({
  description: PropTypes.string,
  metadata: PropTypes.string,
  title: PropTypes.string,
});

/**
 * For use in React prop-type declarations.
 * @const {Object}
 */
export const ItemShape = PropTypes.shape({
  addedAt: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  metadata: ItemMetadataShape,
  status: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  updatedBy: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
});

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

/**
 * 
 * @param {Item} item 
 * @returns {string} - video description.
 */
export const getDescription = item => (item.metadata && item.metadata.description);

/**
 * Sets the status to Failed.
 * @param {Object} args
 * @param {Item} args.item
 * @param {string} args.errorMessage
 * @returns {Item} - a new Item object with the updated status.
 */
export const markItemFailed = ({ errorMessage, item }) => ({
  ...item,
  errorMessage,
  status: Status.Failed,
  updatedAt: new Date().toISOString(),
  updatedBy: System,
});

/**
 * Sets the status to Canceled (a particular failure mode with an associated user).
 * @param {Object} args
 * @param {Item} args.item
 * @param {string} args.updatedBy
 * @returns {Item} - a new Item object with the updated status.
 */
export const markItemCanceled = ({ item, updatedBy }) => ({
  ...item,
  errorMessage: "Canceled",
  status: Status.Failed,
  updatedAt: new Date().toISOString(),
  updatedBy,
});

/**
 * Sets the status to Succesful.
 * @param {Item} item
 * @returns {Item} - a new Item object with the updated status.
 */
export const markItemSuccessful = item => ({
  ...item,
  status: Status.Succeeded,
  updatedAt: new Date().toISOString(),
  updatedBy: System,
});

/**
 * Sets the status to InProgress.
 * @param {Item} item
 * @returns {Item} - a new Item object with the updated status.
 */
export const markItemInProgress = item => ({
  ...item,
  status: Status.Running,
  updatedAt: new Date().toISOString(),
  updatedBy: System,
});

/**
 * Sets Metadata.
 * @param {Object} args
 * @param {Item} args.item
 * @param {ItemMetadata} args.metadata
 * @returns {Item} - a new Item object with the updated metadata.
 */
export const setMetadata = ({ item, metadata }) => ({
  ...item,
  updatedAt: new Date().toISOString(),
  metadata,
});
