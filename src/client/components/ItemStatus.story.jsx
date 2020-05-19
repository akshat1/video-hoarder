import React from "react";
import { withKnobs, radios } from "@storybook/addon-knobs";
import ItemStatus from "./ItemStatus.jsx";
import { Status } from "../../Status";

export default {
  title: "ItemStatus",
  component: ItemStatus,
  decorators: [withKnobs],
};

export const Default = () =>
  <ItemStatus status={radios("Status", Object.values(Status), Status.Pending)} />;

export const SideBySide = () =>
  <div>
    <ItemStatus status={Status.Pending} />
    <ItemStatus status={Status.Running} />
    <ItemStatus status={Status.Succeeded} />
    <ItemStatus status={Status.Failed} />
    <ItemStatus status={"fubar"} />
  </div>