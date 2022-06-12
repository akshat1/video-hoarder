/**
 * Centralised logic for obtaining various internal URLs. Shared between server and client environments.
 */

import { getLogger } from "./logger";

const logger = getLogger("appUrls");

// Webpack environment plugin doesn't seem to work with destructuring :-/
const APP_HOST = process.env.APP_HOST || "localhost";
const APP_PORT = process.env.APP_PORT || "8080";  // This is the port on which the server is actually listening.
const EXPOSED_PORT = process.env.EXPOSED_PORT || APP_PORT;  // This is the port visible to the outside world (in case there's proxies involved).
const APP_SCHEME = typeof process.env.APP_SCHEME === "undefined" ? (Number(EXPOSED_PORT) === 443 ? "https" : "http") : process.env.APP_SCHEME;
const WS_SCHEME = APP_SCHEME === "https" ? "wss" : "ws";

export const getAppPort = (): string => APP_PORT;

export const getExposedPort = (): string => EXPOSED_PORT;

export const getCORSOrigin = (): string => `${APP_SCHEME}://${APP_HOST}:${EXPOSED_PORT}`;

export const getServerURL = (): string => `${APP_SCHEME}://${APP_HOST}:${EXPOSED_PORT}`;

export const getWebSocketLinkURL = (): string => `${WS_SCHEME}://${APP_HOST}:${EXPOSED_PORT}/graphql`;

export const getHTTPLinkURL = (): string => `${APP_SCHEME}://${APP_HOST}:${EXPOSED_PORT}/graphql`;

logger.debug("Env:", JSON.stringify(process.env, null, 2));
logger.debug(JSON.stringify({
  APP_HOST,
  APP_PORT,
  EXPOSED_PORT,
  APP_SCHEME,
  WS_SCHEME,
  corsOrigin: getCORSOrigin(),
  serverURL: getServerURL(),
  webSocketLinkURL: getWebSocketLinkURL(),
  httpLinkURL: getHTTPLinkURL(),
}, null, 2));
