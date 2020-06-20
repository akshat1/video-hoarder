import LoginForm from "./components/LoginForm.jsx";
import Main from "./components/Main.jsx";
import { getHistory } from "./history";
import { initializeClient } from "./redux/actions";
import { isFetchingUser, isLoggedIn, isUserFetchDone } from "./selectors";
import { getTheme } from "./theme";
import { getURL } from "./util.js";
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
    userFetchDone,
    initializeClient,
    loggedIn,
  } = props;

  useEffect(
    () => { initializeClient(); },
    [userFetchDone],
  );

  return (
    <ConnectedRouter history={getHistory()}>
      <ThemeProvider theme={getTheme(prefersDarkMode)}>
        <CssBaseline />
        <Switch>
          <Route exact path={getURL("/login")}>
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
