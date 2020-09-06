import { LoginForm } from "./LoginForm";
import { text } from "@storybook/addon-knobs";
import React from "react";

export default {
  title: "LoginForm",
  component: LoginForm,
};

export const Default = () => (
  <LoginForm
    loginError={text("Login error", "")}
  />
);
