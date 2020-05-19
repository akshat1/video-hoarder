/**
 * Maintains a singleton history instance.
 *
 * @module client/history
 */
import { createBrowserHistory } from "history";
import { getLogger } from "../logger";

let history;

/**
 * @func
 * @returns {BrowserHistory} - the singleton instance of a history object, created using `createBrowserHistory`.
 */
export const getHistory = () => {
  if (!history) {
    getLogger("getHistory").debug("Going to create new history");
    history = createBrowserHistory();
  }

  return history;
}
