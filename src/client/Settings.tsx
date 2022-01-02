import { infoTable } from "./cssUtils";
import { useTitle } from "./hooks";
import { UserSettings } from "./UserSettings";
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
        <Typography
          variant="h4"
        >
          Change password
        </Typography>
      </Grid>
      <UserSettings />
    </Grid>
  );
};
