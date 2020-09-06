import { Status } from "../../Status";
import { getFakeItem } from "../fixtures/item";
import { CancelButton } from "./CancelButton";
import { action } from "@storybook/addon-actions";
import React from "react";

export default {
  title: "CancelButton",
  component: CancelButton,
};

export const Pending = () => (
  <CancelButton
    doCancel={action("Cancel download")}
    item={getFakeItem(Status.Pending)}
  />
);

export const Running = () => (
  <CancelButton
    doCancel={action("Cancel download")}
    item={getFakeItem(Status.Running)}
  />
);

export const Failed = () => (
  <CancelButton
    doCancel={action("Cancel download")}
    item={getFakeItem(Status.Failed)}
  />
);

export const Succeeded = () => (
  <CancelButton
    doCancel={action("Cancel download")}
    item={getFakeItem(Status.Succeeded)}
  />
);
