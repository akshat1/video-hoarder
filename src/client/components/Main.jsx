/**
 * This is the entire logged-in user interface.
 */
import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import Toolbar from './Toolbar.jsx';

const useStyles = makeStyles(() => ({
  container: {
    flexGrow: 1,
    maxWidth: '100%',
    // width: '100%'
    margin: 0,
    padding: 0,
  }
}));

const Main = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Toolbar />
    </Container>
  );
};

Main.propTypes = {};

export default connect()(Main);
