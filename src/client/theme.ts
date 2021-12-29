import { createTheme } from "@mui/material/styles";
import _ from "lodash";

export const getTheme:any = _.memoize(darkMode =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  }),
);
