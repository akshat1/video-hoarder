import { hot } from 'react-hot-loader';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import _ from 'lodash';
import { createBrowserHistory } from 'history';
import InputForm from './components/InputForm';
import * as Style from './App.less';
import { Switch, Route } from 'react-router';
import { isLoggedIn, isFetchingUser, isUserFetchDone } from './selectors';
import { connect } from 'react-redux';
import LoginForm from './components/LoginForm';
import { fetchUser } from './redux/actions-and-reducers';

/**
 * The data fetching effect function is created through this function so that we may easily unit
 * test it independently of the `App` component.
 *
 * @param {Object} args
 * @param {string} args.pathName
 * @param {boolean} args.fetchingUser
 * @param {boolean} args.userFetchDone
 * @param {boolean} args.loggedIn
 * @param {function} args.fetchUser
 * @returns {function}
 */
const getDataFetchEffect = ({ pathName, fetchingUser, userFetchDone, loggedIn, fetchUser }) =>
  /**
   * If we are not currently trying to, and haven't already tried to, fetch the current user then we try to do that.
   * Othwrwise, if the user if not logged-in, then redirects to the login form if not already there.
   * Otherwise, if the user is on the log-in page but is also logged-in thn redirects to `/`.
   */
  () => {
    if (fetchingUser) {
      return;
    }

    if (!userFetchDone) {
      fetchUser();
      return;
    }

    if (pathName === '/login' && loggedIn) {
      location.href = '/';
      return;
    }

    if (pathName !== '/login' && !loggedIn) {
      location.href = '/login';
      return;
    }
  };

const App = (props) => {
  const {
    fetchingUser,
    fetchUser,
    loggedIn,
    pathName,
    userFetchDone,
  } = props;

  useEffect(
    getDataFetchEffect({ pathName, fetchingUser, userFetchDone, loggedIn, fetchUser }),
    [pathName, fetchingUser, userFetchDone, loggedIn]
  );

  return (
    <ConnectedRouter history={createBrowserHistory()}>
      <div id={Style.App}>
        <If condition={!fetchingUser}>
          <Switch>
            <Route path="/login">
              <LoginForm />
            </Route>
            <Route path="/">
              <Choose>
                <When condition={loggedIn}>
                  <InputForm onSubmit={() => 0}/>
                </When>
              </Choose>
            </Route>
          </Switch>
        </If>
      </div>
    </ConnectedRouter>
  );
};

App.propTypes = {
  fetchingUser: PropTypes.bool,
  fetchUser: PropTypes.func,
  loggedIn: PropTypes.bool,
  pathName: PropTypes.string,
  userFetchDone: PropTypes.bool,
};

/**
 * @private
 * @returns {boolean}
 */
const isDevMode = () => process.env.NODE_ENV === 'development';

const stateToProps = state => ({
  fetchingUser: isFetchingUser(state),
  userFetchDone: isUserFetchDone(state),
  loggedIn: isLoggedIn(state),
  pathName: _.get(state, 'router.location.pathname'),
});

const dispatchToProps = { fetchUser };

export { App };
const ConnectedApp = connect(stateToProps, dispatchToProps)(App);
export default isDevMode() ? hot(module)(ConnectedApp) : ConnectedApp;
