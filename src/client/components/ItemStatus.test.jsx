import { Status } from "../../Status";
import { getTheme } from "../theme";
import ItemStatus from "./ItemStatus.jsx";
import { ThemeProvider } from "@material-ui/styles";
import { shallow } from "enzyme";
import React from "react";

describe("components/ItemStatus", () => {
  Object.values(Status).forEach((status) =>
    test(`ItemStatus matches snapshot for ${status}`, () => {
      const instance = <ThemeProvider theme={getTheme()}><ItemStatus status={status} /></ThemeProvider>;
      expect(shallow(instance)).toMatchSnapshot();
    }),
  );
});
