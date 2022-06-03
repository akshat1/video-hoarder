import { getHTTPLinkURL, getWebSocketLinkURL } from "../utility/appUrls";
import { App } from "./App";
import { getApolloClientCache } from "./getApolloClientCache";
import { getTheme } from "./theme";
import { ApolloClient, ApolloProvider, HttpLink, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { StyledEngineProvider,Theme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";


declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


let apolloClient: ApolloClient<any>;
const getApolloClient = ():ApolloClient<any> => {
  if (!apolloClient) {
    const wsLink = new WebSocketLink({
      uri: getWebSocketLinkURL(),
      options: {
        reconnect: true,
      },
    });

    const httpLink = new HttpLink({
      uri: getHTTPLinkURL(),
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
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={getTheme(prefersDarkMode)}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </StyledEngineProvider>
      </Router>
    </ApolloProvider>
  );
};

const onDOMContentLoaded = () => {
  const target = document.getElementById("root");
  ReactDOM.render(<AppWrapper />, target);
};
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
