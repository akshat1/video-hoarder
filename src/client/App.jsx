import { connect } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { getHistory } from "./history";
import { hot } from "react-hot-loader";
import { initializeClient } from "./redux/actions-and-reducers";
import { isLoggedIn, isFetchingUser, isUserFetchDone, } from "./selectors";
import { Switch, Route } from "react-router";
import { getTheme } from "./theme";
import LoginForm from "./components/LoginForm.jsx";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import { CssBaseline, useMediaQuery } from "@material-ui/core";
import Main from "./components/Main.jsx";

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
    userFetchDone,
    initializeClient,
    loggedIn,
  } = props;

  useEffect(
    () => { initializeClient(); },
    [userFetchDone]
  );

  return (
    <ConnectedRouter history={getHistory()}>
      <ThemeProvider theme={getTheme(prefersDarkMode)}>
        <CssBaseline />
        <Switch>
          <Route path="/login">
            <LoginForm className={classes.loginForm}/>
          </Route>
          <Route path="/">
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
});

const dispatchToProps = { initializeClient };

export { App };
const ConnectedApp = connect(stateToProps, dispatchToProps)(App);
// eslint-disable-next-line import/no-default-export
export default isDevMode() ? hot(module)(ConnectedApp) : ConnectedApp;
