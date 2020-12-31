import { getLogger } from "../../logger";
import express, { Request, Response, Router } from "express";
import { ConfigurationPreset, ConfigurationPresetID } from "../../model/ConfigurationPreset";
import { getPresets as getConfigPresets } from "../db/config-management";
import { ensureValidUser } from "../express-middleware";

const rootLogger = getLogger("api/config-management");

// Actually a POST.
export const getPresets = async (req: Request, res: Response): Promise<void> => {
  const logger = getLogger("getPresets", rootLogger);
  try {
    // @ts-ignore
    const currentUser:ServerUser = req.user;
    const { userName } = currentUser;
    const { tool } = req.body;
    logger.debug({ userName, tool });
    const presets = await(getConfigPresets({ tool, userName }));
    res.json({
      count: presets.length,
      data: presets,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send("SERVER ERROR");
  }
};

export const getRouter = (): Router => {
  const configManagement = express.Router();
  configManagement.use(ensureValidUser);
  configManagement.post("/presets", getPresets);
  return configManagement;
};
