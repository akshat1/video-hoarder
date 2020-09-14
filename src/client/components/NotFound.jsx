import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles(() => ({
  root: {
    margin: "auto",
  },
}));

const NotFound = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h1">Not Found</Typography>
    </div>
  );
};

export default NotFound;
