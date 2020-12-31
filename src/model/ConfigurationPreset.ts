/** A separate type because in the future we might turn this into a number, or enforce a format */
export type ConfigurationPresetID = string;

/** A data structure for passing around pre-saved configurations. */
export interface ConfigurationPreset {
  /** Which external tool is this config for? for now, it's always ytdl. */
  tool: string,
  /** The actual configuration value that will be passed to the tool (ytdl, for instance). */
  configurationValue: string
  id: string
  /** The preset name, to be used for UI. */
  name: ConfigurationPresetID
}

export const findPresetById = (presets: ConfigurationPreset[], presetID: ConfigurationPresetID): ConfigurationPreset =>
  (presets || []).find(preset => preset.id === presetID);
