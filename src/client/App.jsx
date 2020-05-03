import { hot } from 'react-hot-loader';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { InputForm } from './components/InputForm.jsx';
import * as Style from './App.less';
import { Switch, Route } from 'react-router';
import { isLoggedIn, isFetchingUser, isUserFetchDone, } from './selectors';
import { connect } from 'react-redux';
import LoginForm from './components/LoginForm.jsx';
import { initializeClient } from './redux/actions-and-reducers';

const App = (props) => {
  const {
    userFetchDone,
    fetchingUser,
    initializeClient,
    loggedIn,
  } = props;

  useEffect(
    () => { initializeClient(); },
    [userFetchDone]
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
  initializeClient: PropTypes.func,
  loggedIn: PropTypes.bool,
  userFetchDone: PropTypes.bool,
};

/**
 * @private
 * @returns {boolean}
 */
const isDevMode = () => process.env.NODE_ENV === 'development';

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
