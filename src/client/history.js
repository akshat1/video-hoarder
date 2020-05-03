/**
 * Maintains a singleton history instance.
 *
 * @module client/history
 */
import { createBrowserHistory } from 'history';

let history;

/**
 * @func
 * @returns {BrowserHistory} - the singleton instance of a history object, created using `createBrowserHistory`.
 */
export const getHistory = () => {
  if (!history) {
    history = createBrowserHistory();
  }

  return history;
}
