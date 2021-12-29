import { Mutation,Query } from "./gql";
import { Home } from "./Home";
import { LoginForm } from "./LoginForm";
import { Settings as SettingsPage } from "./Settings";
import { useMutation, useQuery } from "@apollo/client";
import { Add, ArrowBack, ExitToApp, Settings } from "@mui/icons-material";
import { Container, IconButton, Theme, Toolbar } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import _ from "lodash";
import React, { Fragment, FunctionComponent } from "react";
import { Route, Switch } from "react-router-dom";

const useStyles = makeStyles((theme:Theme) => ({
  root: {
    height: "100vh",
    padding: 0,
  },

  view: {
    padding: theme.spacing(2),
  },
}));

export const Main:FunctionComponent = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(Query.CurrentUser);
  const [logout, logoutThunk] = useMutation(
    Mutation.Logout,
    {
      update: (cache) => cache.writeQuery({
        query: Query.CurrentUser,
        data: { currentUser: null },
      }),
    }
  );

  const loggedIn = !!data?.currentUser?.user;
  const handleLogoutClick = _.debounce(() => logout(), 250);
  const showBackButton = false;

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const loggedOutView = <LoginForm error={error} />;

  const buttons = [];
  if (showBackButton) {
    buttons.push(
      <IconButton
        aria-label="Go back"
        color="inherit"
        edge="start"
        key="btn-back"
        size="large">
        <ArrowBack />
      </IconButton>
    );
  }

  buttons.push(
    <IconButton
      aria-label="Add a new download"
      color="inherit"
      edge="start"
      key="btn-add-new-download"
      size="large">
      <Add />
    </IconButton>,
    <IconButton
      aria-label="Settings"
      color="inherit"
      edge="start"
      key="btn-settings"
      href="./settings"
      size="large">
      <Settings />
    </IconButton>,
    <IconButton
      aria-label="Log Out"
      color="inherit"
      edge="start"
      key="btn-logout"
      disabled={logoutThunk.loading}
      onClick={handleLogoutClick}
      size="large">
      <ExitToApp />
    </IconButton>
  );
  
  const loggedInView = (
    <Fragment>
      <Toolbar>
        {buttons}
      </Toolbar>
      <Container className={classes.view}>
        <Switch>
          <Route exact path={["/", "/add"]}>
            <Home />
          </Route>
          <Route exact path="/settings"><SettingsPage /></Route>
        </Switch>
      </Container>
    </Fragment>
  );

  return (
    <Container className={classes.root}>
      {loggedIn ? loggedInView : loggedOutView}
    </Container>
  );
};
