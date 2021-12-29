import { infoTable } from "./cssUtils";
import { useTitle } from "./hooks";
import { Grid, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FunctionComponent } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  passwordInputForm: {
    ...infoTable(theme),
  },
}));

export const Settings:FunctionComponent = () => {
  useTitle("Settings");
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12}>
        <Typography>
          Change password
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form className={classes.passwordInputForm}>
          <Typography>Current password</Typography>
          <Typography>CP</Typography>
          <Typography>New password</Typography>
          <Typography>NP</Typography>
          <Typography>Re-enter new password</Typography>
          <Typography>rnp</Typography>
        </form>
      </Grid>
    </Grid>
  );
};
