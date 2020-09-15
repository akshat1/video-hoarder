import LoginForm from "./components/LoginForm";
import Main from "./components/Main";
import { CssBaseline, makeStyles, ThemeProvider,useMediaQuery } from "./components/mui";
import { getHistory } from "./history";
import { initializeClient } from "./redux/session-management";
import { getPathname,isFetchingUser, isLoggedIn, isUserFetchDone } from "./selectors";
import { getTheme } from "./theme";
import { getURL } from "./util";
import { ConnectedRouter } from "connected-react-router";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
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
export default connect(stateToProps, dispatchToProps)(App);
