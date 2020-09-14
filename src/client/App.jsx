import LoginForm from "./components/LoginForm";
import Main from "./components/Main";
import { getHistory } from "./history";
import { initializeClient } from "./redux/session-management";
import { getPathname,isFetchingUser, isLoggedIn, isUserFetchDone } from "./selectors";
import { getTheme } from "./theme";
import { getURL } from "./util";
import { useMediaQuery } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import { ConnectedRouter } from "connected-react-router";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { Route,Switch } from "react-router";

const useStyles = makeStyles(() => ({
  container: {},
  loginForm: {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const App = (props) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const classes = useStyles();
  const {
    initializeClient,
    loggedIn,
    pathname,
    userFetchDone,
  } = props;

  useEffect(
    () => { initializeClient(); },
    [userFetchDone, pathname, initializeClient],
  );

  return (
    <ConnectedRouter history={getHistory()}>
      <ThemeProvider theme={getTheme(prefersDarkMode)}>
        <CssBaseline />
        <Switch>
          <Route
            exact
            path={getURL("/login")}
          >
            <LoginForm className={classes.loginForm}/>
          </Route>
          <Route path={getURL("*")}>
            <Choose>
              <When condition={loggedIn}>
                <Main />
              </When>
            </Choose>
          </Route>
        </Switch>
      </ThemeProvider>
    </ConnectedRouter>
  );
};

App.propTypes = {
  fetchingUser: PropTypes.bool,
  initializeClient: PropTypes.func,
  loggedIn: PropTypes.bool,
  userFetchDone: PropTypes.bool,
  pathname: PropTypes.string,
};

/**
 * @private
 * @returns {boolean}
 */
const isDevMode = () => process.env.NODE_ENV === "development";

const stateToProps = state => ({
  fetchingUser: isFetchingUser(state),
  loggedIn: isLoggedIn(state),
  userFetchDone: isUserFetchDone(state),
  pathname: getPathname(state),
});

const dispatchToProps = { initializeClient };

export { App };
const ConnectedApp = connect(stateToProps, dispatchToProps)(App);
// eslint-disable-next-line import/no-default-export
export default isDevMode() ? hot(module)(ConnectedApp) : ConnectedApp;
