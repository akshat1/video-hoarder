import { getTheme } from "../theme";
import { ThemeProvider } from "./mui";
import { Toolbar } from "./Toolbar";
import { shallow } from "enzyme";
import React from "react";

describe("components/Toolbar", () => {
  test("component should render", () => {
    const instance = shallow(<ThemeProvider theme={getTheme()}><Toolbar /></ThemeProvider>);
    expect(instance).toMatchSnapshot();
  });
});