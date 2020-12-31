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

// Thanks to https://gist.github.com/umidjons/8a15ba3813039626553929458e3ad1fc
export const AudioOnlyConfig =
`-i
--extract-audio
--audio-format mp3
--audio-quality 0
-o %(title)s.%(ext)s`;

export const UseNetRCConfig = "-n";

export const SimplePreset: ConfigurationPreset = {
  configurationValue: "A simple configuration",
  id: "SimpleConfig",
  name: "Simple Config",
  tool: "youtube-dl",
};

export const EverythingPreset: ConfigurationPreset = {
  configurationValue: EverythingConfig,
  id: "EverythingConfig",
  name: "Everything Config",
  tool: "youtube-dl",
};

export const AudioOnlyPreset: ConfigurationPreset = {
  configurationValue: AudioOnlyConfig,
  id: "AudioOnly",
  name: "Music",
  tool: "youtube-dl",
};

export const UseNetRCPreset: ConfigurationPreset = {
  configurationValue: UseNetRCConfig,
  id: "UseNetRC",
  name: "Use .netrc",
  tool: "youtube-dl",
};
