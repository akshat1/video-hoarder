import { ConfigurationPreset } from "../../model/ConfigurationPreset";

export const EverythingConfig = 
`-o download/%(title)s/%(title)s.%(ext)s
-f bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4
--write-sub
--write-auto-sub
--sub-lang en
--write-description
--write-info-json
--write-annotations
--write-thumbnail`;

export const AudioOnlyConfig =
`
-i
--extract-audio
--audio-format mp3
--audio-quality 0
-o "%(title)s.%(ext)s"
`;

export const UseNetRCConfig =
`
-n
`;

export const SimplePreset: ConfigurationPreset = {
  id: "SimpleConfig",
  name: "Simple Config",
  configurationValue: "A simple configuration",
};

export const EverythingPreset: ConfigurationPreset = {
  id: "EverythingConfig",
  name: "Everything Config",
  configurationValue: EverythingConfig,
};

// Thanks to https://gist.github.com/umidjons/8a15ba3813039626553929458e3ad1fc
export const AudioOnlyPreset: ConfigurationPreset = {
  id: "AudioOnly",
  name: "Music",
  configurationValue: AudioOnlyConfig,
};

export const UseNetRCPreset: ConfigurationPreset = {
  id: "UseNetRC",
  name: "Use .netrc",
  configurationValue: UseNetRCConfig,
};
