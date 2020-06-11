/**
 * This is the entire logged-in user interface.
 */
import { getJobs } from "../selectors.js";
import { getURL } from "../util.js";
import AccountSettings from "./AccountSettings.jsx";
import InputForm from "./InputForm.jsx";
import Item from "./Item.jsx";
import ItemFilter from "./ItemFilter.jsx";
import Toolbar from "./Toolbar.jsx";
import { Container, Divider, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Route,Switch } from "react-router";

const useStyles = makeStyles((theme) => {
  const spacing = theme.spacing(2);
  return {
    container: {
      flexGrow: 1,
      maxWidth: "100%",
      margin: 0,
      padding: 0,
    },

    body: {
      padding: spacing,
    },

    inputForm: {
      paddingBottom: spacing,
    },

    jobs: {
      paddingTop: spacing,
    },
  }
});

const Main = ({ jobs }) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Toolbar />
      <div className={classes.body}>
        <Switch>
          <Route exact path={getURL("/")}>
            <InputForm className={classes.inputForm} />
            <Divider />
            <Grid container spacing={3} className={classes.jobs}>
              <Grid item>
                <ItemFilter />
              </Grid>
              <For each="job" of={jobs}>
                <Grid item xs={12}>
                  <Item key={job.id} item={job}/>
                  <Divider />
                </Grid>
              </For>
            </Grid>
          </Route>
          <Route path={getURL("/account")}>
            <AccountSettings />
          </Route>
        </Switch>
      </div>
    </Container>
  );
};

Main.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.object),
};

const stateToProps = state => ({
  jobs: getJobs(state),
})

export default connect(stateToProps)(Main);
