import { App } from "./App";
import { getApolloClientCache } from "./getApolloClientCache";
import { getTheme } from "./theme";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { CssBaseline, useMediaQuery } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

let apolloClient: ApolloClient<any>;
const getApolloClient = ():ApolloClient<any> => {
  if (!apolloClient) {
    apolloClient = new ApolloClient({
      uri: `http://localhost:${8081}/graphql`,
      cache: getApolloClientCache(),
      credentials: "include",
    });
  }

  return apolloClient;
}

const AppWrapper:React.FunctionComponent = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <ApolloProvider client={getApolloClient()}>
      <Router>
        <ThemeProvider theme={getTheme(prefersDarkMode)}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Router>
    </ApolloProvider>
  );
};

const onDOMContentLoaded = () => {
  const target = document.getElementById("root");
  ReactDOM.render(<AppWrapper />, target);
};
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
