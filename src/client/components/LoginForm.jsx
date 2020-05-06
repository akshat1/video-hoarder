import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { doLogIn } from '../redux/actions-and-reducers';
import Style from './LoginForm.less';
import { getLoginError, isFetchingUser, isLoggedIn } from '../selectors';

/**
 * @param {Object} args -
 * @param {string} args.username -
 * @param {string} args.password -
 * @param {boolean} args.fetchingUser -
 * @param {boolean} args.loggedIn -
 * @returns {boolean}
 */
const isSubmitDisable = ({ userName, password, fetchingUser, loggedIn }) =>
  loggedIn || fetchingUser || !(userName && password);

const LoginForm = (props) => {
  const {
    className,
    doLogin,
    fetchingUser,
    loggedIn,
    loginError,
  } = props;

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const onSubmit = e => {
    e.preventDefault();
    doLogin(userName, password);
    setUserName('');
    setPassword('');
  }
  const onUserNameChanged = e => setUserName(e.currentTarget.value);
  const onPasswordChanged = e => setPassword(e.currentTarget.value);

  return (
    <div className={`${Style.wrapper} ${className}`}>
      <Choose>
        <When condition={loggedIn}>
          Logging you in...
        </When>
        <Otherwise>
          <form onSubmit={onSubmit} className={Style.form}>
            <input
              className={Style.username}
              title="Enter your username"
              type="text"
              placeholder="Username"
              value={userName}
              onChange={onUserNameChanged}
              required
            />
            <input
              className={Style.password}
              title="Enter your password"
              type="password"
              value={password}
              onChange={onPasswordChanged}
              required
            />
            <button
              className={Style.submit}
              type="submit"
              role="button"
              title="Login"
              disabled={isSubmitDisable({ userName, password, fetchingUser, loggedIn })}
            >
              Login
            </button>
            <If condition={loginError}>
              <div className={Style.error}>
                {loginError}
              </div>
            </If>
          </form>
        </Otherwise>
      </Choose>
    </div>
  );
};

LoginForm.propTypes = {
  className: PropTypes.string,
  doLogin: PropTypes.func,
  fetchingUser: PropTypes.bool,
  loggedIn: PropTypes.bool,
  loginError: PropTypes.string,
};

LoginForm.defaultProps = {
  className: '',
};

const stateToProps = state => ({
  fetchingUser: isFetchingUser(state),
  loggedIn: isLoggedIn(state),
  loginError: getLoginError(state),
});
const dispatchToProps = { doLogin: doLogIn };

export default connect(stateToProps, dispatchToProps)(LoginForm);
