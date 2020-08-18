import { getURL } from "../../util";
import { goBack,push } from "connected-react-router"

export const goToAccountScreen = () => push(getURL("/account"));

export const goToHome = () => push(getURL(`/${location.search}${location.hash}`));

export const goToLogin = () => push(getURL(`/login${location.search}${location.hash}`));

export const goToSettings = () => push(getURL("/settings"));

export const clearQuery = () => push(getURL(""));

export { goBack };
