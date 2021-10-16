import { Job } from "../model/Job";
import { Query } from "./gql";
import { Item } from "./Item";
import { useQuery } from "@apollo/client";
import { Grid } from "@material-ui/core";
import React, { FunctionComponent } from "react";

export const ItemList:FunctionComponent = () => {
  const {
    data,
    loading: fetchingJobs,
    error: jobFetchingError,
  } = useQuery<{jobs: Job[]}>(Query.Jobs);

  let loadingElement = null;
  let errorElement = null;
  let jobElements = null;

  if (fetchingJobs) {
    loadingElement = <>Loading</>;
  }

  if (jobFetchingError) {
    errorElement = <>Error</>;
  }

  if (data?.jobs && !(fetchingJobs && jobFetchingError)) {
    jobElements = data.jobs.map(j =>
      <Grid item xs={12} key={j.id}>
        <Item job={j}/>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>Filter</Grid>
      {loadingElement}
      {errorElement}
      {jobElements}
    </Grid>
  );
};
