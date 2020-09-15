/** @jest-environment jsdom */
import { App } from "./App";
import { ThemeProvider } from "./components/mui";
import { getTheme } from "./theme";
import { shallow } from "enzyme";
import React from "react";

describe("App", () => {
  test("App matches snapshot", () => {
    const instance = shallow(<ThemeProvider theme={getTheme()}><App /></ThemeProvider>);
    expect(instance).toMatchSnapshot();
  });
});
