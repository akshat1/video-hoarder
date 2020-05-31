import InputForm from "./InputForm.jsx";
import { action } from "@storybook/addon-actions";
import { text,withKnobs } from "@storybook/addon-knobs";
import React from "react";

export default {
  title: "InputForm",
  component: InputForm,
  decorators: [withKnobs],
};

export const Default = () =>
  <InputForm
    onSubmit={action("submit")}
    initialValue={text("Initial value (initialValue)", "https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
  />;
