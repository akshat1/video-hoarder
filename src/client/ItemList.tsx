import { Grid } from "@material-ui/core";
import React, { FunctionComponent } from "react";

export const ItemList:FunctionComponent = () => {
  return (
    <Grid container>
      <Grid xs={12}>Filter</Grid>
      <Grid xs={12}>Items</Grid>
    </Grid>
  );
};
