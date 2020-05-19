import React from "react";
import { Toolbar } from "./Toolbar.jsx";
import { action } from "@storybook/addon-actions";
import { boolean, text } from "@storybook/addon-knobs";


export default {
  title: "Toolbar",
  component: Toolbar,
};

export const Default = () =>
  <Toolbar
    doLogOut={action("doLogOut")}
    loggedIn={boolean("Logged in?", true)}
    userName={text("Username", "admin")}
  />;
