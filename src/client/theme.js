import { createMuiTheme } from "./components/mui";
import _ from "lodash";

export const getTheme = _.memoize(darkMode =>
  createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
  }),
);
