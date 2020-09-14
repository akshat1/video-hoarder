import { getLogger } from "../logger";
import { createBrowserHistory, History } from "history";

let history: History;
export const getHistory = (): History => {
  if (!history) {
    getLogger("getHistory").debug("Going to create new history");
    history = createBrowserHistory();
  }

  return history;
}
