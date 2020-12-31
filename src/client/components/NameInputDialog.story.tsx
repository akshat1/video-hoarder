import NameInputDialog from "./NameInputDialog";
import { action } from "@storybook/addon-actions";
import { boolean,text  } from "@storybook/addon-knobs";
import React, { FunctionComponent } from "react";

export default {
  title: "Name input dialog",
  component: NameInputDialog,
};

const onSaveAction = action("onSave");
const asyncOnSaveAction = (name) =>
  new Promise<void>(resolve => setTimeout(() => {
    onSaveAction(name);
    resolve();
  }, 5000));

export const Default:FunctionComponent = () => (
  <NameInputDialog
    errorMessage={text("errorMessage", "")}
    helperText={text("helperText", "Some text to establish context.")}
    onCancel={action("onCancel")}
    onSave={asyncOnSaveAction}
    open={boolean("open", true)}
    title={text("title", "Enter name")}
  />
);

export const WithPreviousValue:FunctionComponent = () => (
  <NameInputDialog
    errorMessage={text("errorMessage", "")}
    helperText={text("helperText", "Some text to establish context.")}
    onCancel={action("onCancel")}
    onSave={asyncOnSaveAction}
    open={boolean("open", true)}
    title={text("title", "Enter name")}
    value={text("value", "NoName001.cpp")}
  />
);

export const WithErrorMessage:FunctionComponent = () => (
  <NameInputDialog
    errorMessage={text("errorMessage", "Name already in use. Please select another name.")}
    helperText={text("helperText", "Some text to establish context.")}
    onCancel={action("onCancel")}
    onSave={asyncOnSaveAction}
    open={boolean("open", true)}
    title={text("title", "Enter name")}
    value={text("value", "NoName001.cpp")}
  />
);
