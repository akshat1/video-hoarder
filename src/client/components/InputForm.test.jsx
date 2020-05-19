import { getTheme } from "../theme";
import InputForm from "./InputForm.jsx";
import { ThemeProvider } from "@material-ui/styles";
import { shallow } from "enzyme";
import React from "react";

describe("components/InputForm", () => {
  test("InputForm matches snapshot", () => {
    const instance = (
      <ThemeProvider theme={getTheme()}>
        <InputForm onSubmit={() => 0}/>
      </ThemeProvider>
    );
    const mounted = shallow(instance);
    expect(mounted).toMatchSnapshot();
  });
});
