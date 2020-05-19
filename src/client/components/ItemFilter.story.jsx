import { Status } from "../../Status";
import ItemFilter from "./ItemFilter.jsx";
import { action } from "@storybook/addon-actions";
import { radios } from "@storybook/addon-knobs";
import React from "react";

export default {
  title: "ItemFilter",
  component: ItemFilter,
};



export const Default = () =>
  <ItemFilter
    onChange={action("onChange")}
    value={radios("Value", Object.values(Status).sort(), Status.Running)}
  />;
