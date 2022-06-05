/**
 * Centralised logic for obtaining various internal URLs. Shared between server and client environments.
 */

// Webpack environment plugin doesn't seem to work with destructuring :-/
const APP_HOST = process.env.APP_HOST || "localhost";
const APP_PORT = process.env.APP_PORT || "8080";
const APP_SCHEME = process.env.APP_SCHEME || "http";

export const getAppPort = (): string => APP_PORT;

export const getCORSOrigin = (): string => `${APP_SCHEME}://${APP_HOST}:${APP_PORT}`;

export const getServerURL = (): string => `${APP_SCHEME}://${APP_HOST}:${APP_PORT}`;

export const getWebSocketLinkURL = (): string => `ws://${APP_HOST}:${APP_PORT}/graphql`;

export const getHTTPLinkURL = (): string => `${APP_SCHEME}://${APP_HOST}:${APP_PORT}/graphql`;
