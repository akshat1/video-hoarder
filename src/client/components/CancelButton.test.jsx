import { Status } from "../../Status";
import { getFakeItem } from "../fixtures/item";
import { getTheme } from "../theme";
import { CancelButton } from "./CancelButton.jsx";
import { ThemeProvider } from "@material-ui/styles";
import { shallow } from "enzyme";
import React from "react";

describe("components/CancelButton", () => {
  Object.values(Status).forEach((status) =>
    test(`CancelButton matches snapshot for ${status}`, () => {
      const instance =
        <ThemeProvider theme={getTheme()}>
          <CancelButton item={getFakeItem(status)} doCancel={() => 0}/>
        </ThemeProvider>;
      expect(shallow(instance)).toMatchSnapshot();
    })
  );
});
