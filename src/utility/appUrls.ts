/**
 * Centralised logic for obtaining various internal URLs. Shared between server and client environments.
 */

const {
  APP_HOST = "localhost",
  APP_PORT = "8080",
  APP_SCHEME = "http",
} = process.env;

export const getAppPort = (): string => APP_PORT;

export const getCORSOrigin = (): string => `${APP_SCHEME}://${APP_HOST}:${APP_PORT}`;

export const getServerURL = (): string => `${APP_SCHEME}://${APP_HOST}:${APP_PORT}`;

export const getWebSocketLinkURL = (): string => `ws://${process.env.APP_HOST}:${process.env.APP_PORT}/`;

export const getHTTPLinkURL = (): string => `${APP_SCHEME}://${APP_HOST}:${APP_PORT}/graphql`;
