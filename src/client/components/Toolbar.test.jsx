import { getTheme } from "../theme";
import { Toolbar } from "./Toolbar";
import { ThemeProvider } from "@material-ui/styles";
import { shallow } from "enzyme";
import React from "react";

describe("components/Toolbar", () => {
  test("component should render", () => {
    const instance = shallow(<ThemeProvider theme={getTheme()}><Toolbar /></ThemeProvider>);
    expect(instance).toMatchSnapshot();
  });
});