import { getURL } from "../../util";
import { push } from "connected-react-router"

export const goToAccountScreen = () => push(getURL("/account"));

export const goToHome = () => push(getURL(`/${location.search}${location.hash}`));

export const goToLogin = () => push(getURL(`/login${location.search}${location.hash}`));

export const clearQuery = () => push(getURL(location.pathname));
