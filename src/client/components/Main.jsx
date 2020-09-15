/**
 * This is the entire logged-in user interface.
 */
import { getJobs } from "../selectors";
import { getURL } from "../util";
import AccountSettings from "./AccountSettings";
import InputForm from "./InputForm";
import Item from "./Item";
import ItemFilter from "./ItemFilter";
import { Container, Divider, Grid, makeStyles } from "./mui";
import NotFound from "./NotFound";
import Settings from "./Settings";
import Toolbar from "./Toolbar";
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
          <Route
            exact
            path={getURL("/")}
          >
            <InputForm className={classes.inputForm} />
            <Divider />
            <Grid
              className={classes.jobs}
              container
              spacing={3}
            >
              <Grid item>
                <ItemFilter />
              </Grid>
              <For
                each="job"
                of={jobs}
              >
                <Grid
                  item
                  key={job.id}
                  xs={12}
                >
                  <Item item={job}/>
                  <Divider />
                </Grid>
              </For>
            </Grid>
          </Route>
          <Route
            exact
            path={getURL("/account")}
          >
            <AccountSettings />
          </Route>
          <Route
            exact
            path={getURL("/settings")}
          >
            <Settings />
          </Route>
          <Route path="*">
            <NotFound />
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
