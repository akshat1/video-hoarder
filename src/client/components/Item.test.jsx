import { Status } from "../../model/Status";
import { getFakeItem } from "../fixtures/item";
import { getTheme } from "../theme";
import Item from "./Item";
import { ThemeProvider } from "@material-ui/styles";
import { shallow } from "enzyme";
import React from "react";

describe("components/Item", () => {
  Object.values(Status).forEach((status) =>
    test(`Item matches snapshot for ${status}`, () => {
      const instance = <ThemeProvider theme={getTheme()}><Item item={getFakeItem(status)} />)</ThemeProvider>
      expect(shallow(instance)).toMatchSnapshot();
    }),
  );
});
