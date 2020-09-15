import { makeStyles,Typography } from "./mui";
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
