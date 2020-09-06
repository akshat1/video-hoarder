import InputForm from "./InputForm";
import { action } from "@storybook/addon-actions";
import { text,withKnobs } from "@storybook/addon-knobs";
import React from "react";

export default {
  title: "InputForm",
  component: InputForm,
  decorators: [withKnobs],
};

export const Default = () => (
  <InputForm
    initialValue={text("Initial value (initialValue)", "https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
    onSubmit={action("submit")}
  />
);
