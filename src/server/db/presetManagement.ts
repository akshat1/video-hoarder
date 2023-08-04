import { Preset } from "../../model/Preset";
import { getLogger } from "../../shared/logger";

const rootLogger = getLogger("presetManagement");

interface CreatePresetInput {
  name: string;
  downloadLocation?: string;
  formatSelector?: string;
  rateLimit?: string;
  isPrivate?: boolean;
}

export const createPreset = async (presetStub, createdBy: string): Promise<Preset> => {
  const logger = getLogger("createPreset", rootLogger);
  logger.debug("Creating preset...", presetStub);
  const timeStamp = new Date().toISOString();
  const preset = Preset.create({
    // "" for optional fields.
    downloadLocation: "",
    formatSelector: "",
    rateLimit: "",
    isPrivate: true,

    // default values can be overridden by this step.
    ...presetStub,

    // entity information fields.
    createdAt: timeStamp,
    createdBy,
    updatedAt: timeStamp,
    updatedBy: createdBy,
  });

  logger.debug("Saving preset...", presetStub);
  await preset.save();
  return preset;
}
