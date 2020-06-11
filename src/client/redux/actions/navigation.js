import { getURL } from "../../util";
import { push } from "connected-react-router"

export const goToAccountScreen = () => push(getURL("/account"));

export const goToHome = () => push(getURL("/"));

export const goToLogin = () => push(getURL("/login"));
