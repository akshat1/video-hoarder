import React, { useState } from 'react';

const LoginForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const onSubmit = e => e.preventDefault();  // TODO: Implement the login
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

export default LoginForm;
