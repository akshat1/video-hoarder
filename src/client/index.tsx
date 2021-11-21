import { App } from "./App";
import { getApolloClientCache } from "./getApolloClientCache";
import { getTheme } from "./theme";
import { ApolloClient, ApolloProvider, HttpLink, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { CssBaseline, useMediaQuery } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

if (typeof window !== "undefined" && typeof window.require !== "function") {
  window.require = function(id: string): object {
    switch (id) {
      case './local/zh_CN':
        return {
          confirmLabel: 'OK',
          backspaceLabel: 'backspace',
          cancelKeyboardLabel: 'cancel keyboard'
        }
      default:
        return {}
    }
  }
}

let apolloClient: ApolloClient<any>;
const getApolloClient = ():ApolloClient<any> => {
  if (!apolloClient) {
    const wsLink = new WebSocketLink({
      uri: "ws://localhost:8081/graphql",
      options: {
        reconnect: true,
      },
    });

    const httpLink = new HttpLink({
      uri: "http://localhost:8081/graphql",
      credentials: "include",
    });

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    );

    apolloClient = new ApolloClient({
      link: splitLink,
      cache: getApolloClientCache(),
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
