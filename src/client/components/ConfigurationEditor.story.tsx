import { AudioOnlyPreset, EverythingConfig, EverythingPreset, SimplePreset, UseNetRCPreset } from "../fixtures/configuration-presets";
import { ConfigurationEditor } from "./ConfigurationEditor";
import { action } from "@storybook/addon-actions";
import { text } from "@storybook/addon-knobs";
import React from "react";
import { FunctionComponent } from "react";

export default {
  title: "ConfigurationEditor",
  component: ConfigurationEditor,
};

const doSavePresetAction = action("doSavePreset");
const asyncDoSavePresetAction = async (...args) => doSavePresetAction(...args);

export const Simple: FunctionComponent = () => (
  <ConfigurationEditor
    fetchPresets={() => null}
    configText={text("Config value", EverythingConfig)}
    doSave={action("doSave")}
    doSavePreset={asyncDoSavePresetAction}
    helperText={text("Helper text", "Sample helper text")}
    onCancel={action("onCancel")}
  />
);

export const WithPresetsButNoneSelected: FunctionComponent = () => (
  <ConfigurationEditor
    fetchPresets={() => null}
    doSave={action("doSave")}
    doSavePreset={asyncDoSavePresetAction}
    helperText={text("Helper text", "Sample helper text")}
    onCancel={action("onCancel")}
    presets={[EverythingPreset, AudioOnlyPreset, SimplePreset, UseNetRCPreset]}
  />
);

export const WithPresets: FunctionComponent = () => (
  <ConfigurationEditor
    fetchPresets={() => null}
    doSave={action("doSave")}
    doSavePreset={asyncDoSavePresetAction}
    helperText={text("Helper text", "Sample helper text")}
    onCancel={action("onCancel")}
    presets={[EverythingPreset, AudioOnlyPreset, SimplePreset, UseNetRCPreset]}
    selectedPresetID={AudioOnlyPreset.id}
  />
);
