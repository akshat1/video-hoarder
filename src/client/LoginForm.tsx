import { Mutation,Query } from "./gql";
import { ApolloError, useMutation } from "@apollo/client";
import { Button, Container, TextField, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { FunctionComponent, useState } from "react";

interface IsSubmitDisabledArgs {
  fetchingUser: boolean
  loggedIn: boolean
  password: string
  userName: string
}
export const isSubmitDisabled = ({ loggedIn, fetchingUser, userName, password }: IsSubmitDisabledArgs): boolean =>
  loggedIn || fetchingUser || !(userName && password);

interface PropTypes {
  error?: ApolloError;
}

const useStyles = makeStyles((theme: Theme) => ({
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
  },
}));

export const LoginForm:FunctionComponent<PropTypes> = ({ error }) => {
  const classes = useStyles();
  const [doLogin, { loading: fetchingUser, error: loginError }] = useMutation(
    Mutation.Login,
    {
      update: (cache, { data: { login }}) => cache.writeQuery({
        query: Query.CurrentUser,
        data: { currentUser: { user: login.user } },
      }),
    },
  );
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = e => {
    e.preventDefault();
    doLogin({
      variables: {
        userName,
        password,
      },
    });
    setPassword("");
  }
  const onUserNameChanged = e => setUserName(e.currentTarget.value);
  const onPasswordChanged = e => setPassword(e.currentTarget.value);

  // Render
  let errorDisplay;
  if (error || loginError) {
    errorDisplay = (
      <Typography
        className={classes.loginError}
        color="error"
      >
        {(error || loginError).message}
      </Typography>
    )
  }

  return (
    <Container
      className={classes.container}
      maxWidth="xs"
    >
      <Typography
        component="h1"
        variant="h5"
      >
        Sign In
      </Typography>
      <form
        className={classes.form}
        noValidate
        onSubmit={onSubmit}
      >
        <TextField
          autoFocus
          fullWidth
          id="userName"
          label="Username"
          margin="normal"
          name="username"
          onChange={onUserNameChanged}
          required
          value={userName}
          variant="outlined"
        />
        <TextField
          fullWidth
          id="password"
          label="Password"
          margin="normal"
          name="password"
          onChange={onPasswordChanged}
          required
          type="password"
          value={password}
          variant="outlined"
        />
        <Button
          className={classes.submit}
          color="primary"
          disabled={isSubmitDisabled({ userName, password, fetchingUser, loggedIn: false })}
          fullWidth
          type="submit"
          variant="contained"
        >
          Sign In
        </Button>
      </form>
      {errorDisplay}
    </Container>
  );
};
