import { Preset, PresetInput } from "../../model/Preset";
import { getLogger } from "../../shared/logger";

const rootLogger = getLogger("presetManagement");

export const createPreset = async (presetStub: PresetInput, createdBy: string): Promise<Preset> => {
  const logger = getLogger("createPreset", rootLogger);
  logger.debug("Creating preset...", presetStub);
  const timeStamp = new Date().toISOString();
  const preset = Preset.create({
    // "" for optional fields.
    downloadLocation: "",
    formatSelector: "",
    rateLimit: "",
    isPrivate: true,
    saveMetadata: false,

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
