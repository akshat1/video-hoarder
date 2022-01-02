import {Query } from "./gql";
import { Home } from "./Home";
import { LoginForm } from "./LoginForm";
import { Settings as SettingsPage } from "./Settings";
import { Toolbar } from "./Toolbar";
import { useQuery } from "@apollo/client";
import { Container, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import React, { Fragment, FunctionComponent } from "react";
import { Route, Routes } from "react-router-dom";

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
  const loggedIn = !!data?.currentUser?.user;

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const loggedOutView = <LoginForm error={error} />;
  
  const loggedInView = (
    <Fragment>
      <Toolbar />
      <Container className={classes.view}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<SettingsPage />}/>
        </Routes>
      </Container>
    </Fragment>
  );

  return (
    <Container className={classes.root}>
      {loggedIn ? loggedInView : loggedOutView}
    </Container>
  );
};
