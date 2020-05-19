/**
 * This is the entire logged-in user interface.
 */
import InputForm from "./InputForm.jsx";
import Toolbar from "./Toolbar.jsx";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  container: {
    flexGrow: 1,
    maxWidth: "100%",
    // width: '100%'
    margin: 0,
    padding: 0,
  },

  body: {
    padding: theme.spacing(3),
  }
}));

const Main = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Toolbar />
      <div className={classes.body}>
        <InputForm />
      </div>
    </Container>
  );
};

Main.propTypes = {};

export default connect()(Main);
