import React from "react";
import { text } from "@storybook/addon-knobs";
import { LoginForm } from "./LoginForm.jsx";

export default {
  title: "LoginForm",
  component: LoginForm,
};

export const Default = () =>
  <LoginForm
    loginError={text("Login error", "")}
  />
