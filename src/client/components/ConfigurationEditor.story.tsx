import { AudioOnlyPreset, EverythingConfig, EverythingPreset, SimplePreset, UseNetRCPreset } from "../fixtures/configuration-presets";
import ConfigurationEditor from "./ConfigurationEditor";
import { action } from "@storybook/addon-actions";
import { boolean, text } from "@storybook/addon-knobs";
import React from "react";
import { FunctionComponent } from "react";

export default {
  title: "ConfigurationEditor",
  component: ConfigurationEditor,
};



export const Simple: FunctionComponent = () => (
  <ConfigurationEditor
    configText={text("Config value", EverythingConfig)}
    doSave={action("doSave")}
    helperText={text("Helper text", "Sample helper text")}
    onCancel={action("onCancel")}
    open={boolean("Editor Open", true)}
    title={text("Title", "Configuration editor")}
  />
);

export const WithPresets: FunctionComponent = () => (
  <ConfigurationEditor
    doSave={action("doSave")}
    helperText={text("Helper text", "Sample helper text")}
    onCancel={action("onCancel")}
    open={boolean("Editor Open", true)}
    presets={[EverythingPreset, AudioOnlyPreset, SimplePreset, UseNetRCPreset]}
    selectedPreset={SimplePreset.id}
    title={text("Title", "Configuration editor")}
  />
);
