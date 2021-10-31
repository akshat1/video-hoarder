import { Job } from "../model/Job";
import { Query, Subscription } from "./gql";
import { Item } from "./Item";
import { useQuery, useSubscription } from "@apollo/client";
import { Grid } from "@material-ui/core";
import _ from "lodash";
import React, { FunctionComponent } from "react";

export const ItemList:FunctionComponent = () => {
  const {
    data,
    loading: fetchingJobs,
    error: jobFetchingError,
    refetch: refetchJobs,
  } = useQuery<{jobs: Job[]}>(Query.Jobs);
  const jobs = _.get(data, "jobs", []);

  useSubscription(Subscription.JobAdded, {
    onSubscriptionData: () => refetchJobs(),
  });

  useSubscription(Subscription.JobRemoved, {
    onSubscriptionData: () => refetchJobs(),
  });

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
