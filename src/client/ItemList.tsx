import { Job } from "../model/Job";
import { Query } from "./gql";
import { Item } from "./Item";
import { useQuery } from "@apollo/client";
import { Grid } from "@material-ui/core";
import React, { FunctionComponent } from "react";

export const ItemList:FunctionComponent = () => {
  const {
    data,
    // loading: fetchingJobs,
    // error: jobFetchingError,
  } = useQuery<{jobs: Job[]}>(Query.Jobs);

  const jobElements = (data?.jobs || []).map(j => <Item key={j.id} job={j}/>);

  return (
    <Grid container>
      <Grid item xs={12}>Filter</Grid>
      <Grid item xs={12}>{jobElements}</Grid>
    </Grid>
  );
};
