import { getURL } from "../util";
import { CallHistoryMethodAction, goBack, push } from "connected-react-router"

export const goToAccountScreen = (): CallHistoryMethodAction => push(getURL("/account"));

export const goToHome = (): CallHistoryMethodAction => push(getURL(`/${location.search}${location.hash}`));

export const goToLogin = (): CallHistoryMethodAction => push(getURL(`/login${location.search}${location.hash}`));

export const goToSettings = (): CallHistoryMethodAction => push(getURL("/settings"));

export const clearQuery = (): CallHistoryMethodAction => push(getURL(""));

export { goBack };
