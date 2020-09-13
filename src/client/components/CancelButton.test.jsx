import { Status } from "../../model/Status";
import { getFakeItem } from "../fixtures/item";
import { getTheme } from "../theme";
import { CancelButton } from "./CancelButton";
import { ThemeProvider } from "@material-ui/styles";
import { shallow } from "enzyme";
import React from "react";

describe("components/CancelButton", () => {
  Object.values(Status).forEach((status) =>
    test(`CancelButton matches snapshot for ${status}`, () => {
      const instance =
        (
<ThemeProvider theme={getTheme()}>
          <CancelButton
            doCancel={() => 0}
            item={getFakeItem(status)}
          />
</ThemeProvider>
);
      expect(shallow(instance)).toMatchSnapshot();
    }),
  );
});
