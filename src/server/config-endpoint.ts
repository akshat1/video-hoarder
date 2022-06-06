import { ClientConfig } from "../model/ClientConfig";
import { getHTTPLinkURL, getWebSocketLinkURL } from "./appUrls";
import { RequestHandler, Router } from "express";

export const getClientConfig: RequestHandler = (request, response) => {
  const config: ClientConfig = {
    httpLinkURL: getHTTPLinkURL(),
    webSocketLinkURL: getWebSocketLinkURL(),
  };

  const responseData = `
    if (!window.VideoHoarder) window.VideoHoarder = {};
    window.VideoHoarder.clientConfig = ${JSON.stringify(config)};
  `;

  response.contentType("application/javascript; charset=utf-8");
  return response.send(responseData);
};

export const getRouter = (): Router => {
  const router = Router();
  router.get("/client-config", getClientConfig);
  return router;
};
