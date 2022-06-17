import { Query, Subscription } from "./gql";
import { JobsQueryResponse } from "./gql/job";
import { Item } from "./Item";
import { useQuery, useSubscription } from "@apollo/client";
import { Grid } from "@mui/material";
import _ from "lodash";
import React, { FunctionComponent } from "react";

export const ItemList:FunctionComponent = () => {
  const {
    data,
    loading: fetchingJobs,
    error: jobFetchingError,
    refetch: refetchJobs,
  } = useQuery<JobsQueryResponse>(Query.Jobs);
  const jobs = _.get(data, "jobs", []);

  useSubscription(Subscription.JobAdded, {
    onSubscriptionData: () => refetchJobs(),
  });

  useSubscription(Subscription.JobRemoved, {
    onSubscriptionData: () => refetchJobs(),
  });

  useSubscription(Subscription.JobUpdated);

  let loadingElement = null;
  let errorElement = null;
  let jobElements = [];

  if (fetchingJobs) {
    loadingElement = <>Loading</>;
  }

  if (jobFetchingError) {
    errorElement = <>Error</>;
  }

  if (!(fetchingJobs && jobFetchingError)) {
    jobElements = jobs.map(j =>
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
