/* eslint-disable import/prefer-default-export */
import { Status } from "../Status.js";

/** @typedef {string} StatusFilterValue */

/**
 * @enum {StatusFilterValue}
 */
export const StatusFilterValue = {
  All: "all",
  ...Status,
};
