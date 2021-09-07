import { Container, IconButton, makeStyles, Theme, Toolbar } from "@material-ui/core";
import { AccountBox, Add, ArrowBack, Settings } from "@material-ui/icons";
import React, { FunctionComponent } from "react";
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
  const buttons = [
    <IconButton
      aria-label="Go back"
      color="inherit"
      edge="start"
    >
      <ArrowBack />
    </IconButton>,
    <IconButton
      aria-label="Add a new download"
      color="inherit"
      edge="start"
    >
      <Add />
    </IconButton>,
    <IconButton
      aria-label="Settings"
      color="inherit"
      edge="start"
    >
      <Settings />
    </IconButton>,
    <IconButton
      aria-label="Account"
      color="inherit"
      edge="start"
    >
      <AccountBox />
    </IconButton>,
  ];
  return (
    <Container className={classes.root}>
      <Toolbar>
        {buttons}
      </Toolbar>
      <Container className={classes.view}>
        <Switch>
          <Route exact path="/"><h1>ItemList</h1></Route>
          <Route exact path="/settings"><h1>Settings</h1></Route>
          <Route exact path="/add"><h1>Add New</h1></Route>
        </Switch>
      </Container>
    </Container>
  );
};
