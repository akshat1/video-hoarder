import { createTheme } from "@material-ui/core/styles";
import _ from "lodash";

export const getTheme:any = _.memoize(darkMode =>
  createTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
  }),
);
