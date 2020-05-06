import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { getHistory } from './history';
import { hot } from 'react-hot-loader';
import { initializeClient } from './redux/actions-and-reducers';
import InputForm from './components/InputForm.jsx';
import { isLoggedIn, isFetchingUser, isUserFetchDone, } from './selectors';
import { Switch, Route } from 'react-router';
import Style from './App.less';
import LoginForm from './components/LoginForm.jsx';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

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
    <ConnectedRouter history={getHistory()}>
      <div id={Style.App}>
        <If condition={!fetchingUser}>
          <Switch>
            <Route path="/login">
              <LoginForm className={Style.loginForm} />
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
