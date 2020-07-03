import { Status } from "../../Status";
import ItemStatus from "./ItemStatus.jsx";
import { radios,withKnobs } from "@storybook/addon-knobs";
import React from "react";

export default {
  title: "ItemStatus",
  component: ItemStatus,
  decorators: [withKnobs],
};

export const Default = () =>
  <ItemStatus status={radios("Status", Object.values(Status), Status.Pending)} />;

export const SideBySide = () => (
  <div>
      <ItemStatus status={Status.Pending} />
      <ItemStatus status={Status.Running} />
      <ItemStatus status={Status.Succeeded} />
      <ItemStatus status={Status.Failed} />
      <ItemStatus status={"fubar"} />
  </div>
);
