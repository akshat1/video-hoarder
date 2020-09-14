import { getTheme } from "../theme";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { ThemeProvider } from "@material-ui/styles";
import { shallow } from "enzyme";
import React from "react";

describe("components/DeleteConfirmationDialog", () => {
  test("DeleteConfirmationDialog matches snapshot", () => {
    const instance = 
      (
<ThemeProvider theme={getTheme()}>
        <DeleteConfirmationDialog
          jobTitle="Sample job"
          onCancel={() => 0}
          onConfirm={() => 0}
        />
</ThemeProvider>
);
    expect(shallow(instance)).toMatchSnapshot();
  });
});
