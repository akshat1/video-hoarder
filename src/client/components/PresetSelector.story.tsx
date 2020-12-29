import { AudioOnlyPreset, EverythingPreset, SimplePreset, UseNetRCPreset } from "../fixtures/configuration-presets";
import PresetSelector from "./PresetSelector";
import { action } from "@storybook/addon-actions";
import React, { FunctionComponent } from "react";

export default {
  title: "PresetSelector",
  component: PresetSelector,
};

export const NothingSelected: FunctionComponent = () => (
  <PresetSelector
    onChange={action("OnChange")}
    presets={[EverythingPreset, AudioOnlyPreset, SimplePreset, UseNetRCPreset]}
  />
);

export const SomethingSelected: FunctionComponent = () => (
  <PresetSelector
    onChange={action("OnChange")}
    presets={[EverythingPreset, AudioOnlyPreset, SimplePreset, UseNetRCPreset]}
    selectedPreset={SimplePreset.id}
  />
);
