import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { doLogIn } from '../redux/actions-and-reducers';

const LoginForm = ({ doLogin }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const onSubmit = e => {
    e.preventDefault();
    doLogin(userName, password);
  }
  const onUserNameChanged = e => setUserName(e.currentTarget.value);
  const onPasswordChanged = e => setPassword(e.currentTarget.value);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          title="Enter your username"
          type="text"
          placeholder="Username"
          value={userName}
          onChange={onUserNameChanged}
          required
        />
        <input
          title="Enter your password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
          required
        />
        <button
          type="submit"
          role="button"
          title="Login"
          disabled={!(userName && password)}
        >
          Login
        </button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  doLogin: PropTypes.func,
};

const stateToProps = () => ({});
const dispatchToProps = { doLogin: doLogIn };

export default connect(stateToProps, dispatchToProps)(LoginForm);
