/**
 * This is the entire logged-in user interface.
 */
import { getJobs } from "../selectors.js";
import InputForm from "./InputForm.jsx";
import Item from "./Item.jsx";
import Toolbar from "./Toolbar.jsx";
import { Container, Divider, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  container: {
    flexGrow: 1,
    maxWidth: "100%",
    // width: '100%'
    margin: 0,
    padding: 0,
  },

  body: {
    // padding: theme.spacing(3),
  }
}));

const Main = ({ jobs }) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Toolbar />
      <div className={classes.body}>
        <InputForm />
        <Grid container spacing={3}  className={classes.jobs}>
          <For each="job" of={jobs}>
            <Grid item xs={12}>
              <Item key={job.id} item={job}/>
              <Divider />
            </Grid>
          </For>
        </Grid>
      </div>
    </Container>
  );
};

Main.propTypes = {
  jobs: PropTypes.object,
};

const stateToProps = state => ({
  jobs: getJobs(state),
})

export default connect(stateToProps)(Main);
