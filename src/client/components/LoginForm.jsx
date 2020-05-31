/**
 * Renders the login form.
 *
 * @module client/components/LoginForm
 */
import { doLogIn } from "../redux/actions";
import { getLoginError, isFetchingUser, isLoggedIn } from "../selectors";
import { Button, Container, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  submit: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  form: {
    width: "100%",
  },

  loginError: {
    margin: theme.spacing[2],
  }
}));

/**
 * @func
 * @param {Object} args -
 * @param {string} args.username -
 * @param {string} args.password -
 * @param {boolean} args.fetchingUser -
 * @param {boolean} args.loggedIn -
 * @returns {boolean}
 */
export const isSubmitDisabled = ({ userName, password, fetchingUser, loggedIn, }) =>
  loggedIn || fetchingUser || !(userName && password);

export const LoginForm = (props) => {
  const classes = useStyles();

  const {
    className,
    doLogin,
    fetchingUser,
    loggedIn,
    loginError,
  } = props;

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = e => {
    e.preventDefault();
    doLogin(userName, password);
    setUserName("");
    setPassword("");
  }
  const onUserNameChanged = e => setUserName(e.currentTarget.value);
  const onPasswordChanged = e => setPassword(e.currentTarget.value);

  return (
    <Container className={`${classes.container} ${className}`} maxWidth="xs">
      <Choose>
        <When condition={loggedIn}>
          <Typography component="h1" variant="h5">
            Redirecting...
          </Typography>
        </When>
        <Otherwise>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <form className={classes.form} noValidate onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="userName"
              label="Username"
              name="username"
              autoFocus
              value={userName}
              onChange={onUserNameChanged}
            />
            <TextField
              type="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              value={password}
              onChange={onPasswordChanged}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isSubmitDisabled({ userName, password, fetchingUser, loggedIn })}
            >
              Sign In
            </Button>
            <If condition={loginError}>
              <Typography className={classes.loginError} color="error">
                {loginError}
              </Typography>
            </If>
          </form>
        </Otherwise>
      </Choose>
    </Container>
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
  className: "",
};

const stateToProps = state => ({
  fetchingUser: isFetchingUser(state),
  loggedIn: isLoggedIn(state),
  loginError: getLoginError(state),
});
const dispatchToProps = { doLogin: doLogIn };

export default connect(stateToProps, dispatchToProps)(LoginForm);
