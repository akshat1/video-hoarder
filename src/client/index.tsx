import { App } from "./App";
import { getTheme } from "./theme";
import { CssBaseline, useMediaQuery } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

const AppWrapper:React.FunctionComponent = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  return (
    /// @ts-ignore
    <Router>
      <ThemeProvider theme={getTheme(prefersDarkMode)}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Router>
  );
};

const onDOMContentLoaded = () => {
  const target = document.getElementById("root");
  ReactDOM.render(<AppWrapper />, target);
};
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
