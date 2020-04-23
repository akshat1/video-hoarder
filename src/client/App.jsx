import { hot } from 'react-hot-loader';
import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import InputForm from './components/InputForm';
import * as Style from './App.less';
import { Switch, Route, Redirect } from 'react-router';
import { isLoggedIn } from './selectors';
import { connect } from 'react-redux';
import LoginForm from './components/LoginForm';

const App = ({ loggedIn }) =>
  <ConnectedRouter history={createBrowserHistory()}>
    <div id={Style.App}>
      <Switch>
        <Route path="/login">
          <LoginForm />
        </Route>
        <Route path="/">
          <Choose>
            <When condition={loggedIn}>
              <InputForm onSubmit={() => 0}/>
            </When>
            <Otherwise>
              <Redirect to="/login" />
            </Otherwise>
          </Choose>
        </Route>
      </Switch>
    </div>;
  </ConnectedRouter>;

App.propTypes = {
  loggedIn: PropTypes.bool,
};

/**
 * @private
 * @returns {boolean}
 */
const isDevMode = () => process.env.NODE_ENV === 'development';

const stateToProps = state => ({
  loggedIn: isLoggedIn(state),
});

export { App };
const ConnectedApp = connect(stateToProps)(App);
export default isDevMode() ? hot(module)(ConnectedApp) : ConnectedApp;
