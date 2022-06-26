import { Mutation, Query, Subscription } from "./gql";
import { JobsQueryResponse } from "./gql/job";
import { Item } from "./Item";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { Delete } from "@mui/icons-material";
import { Button, CircularProgress, Grid } from "@mui/material";
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

  const [doCleanUp, cleanUpThunk] = useMutation(Mutation.RemoveAllDoneJobs, {
    refetchQueries: [{ query: Query.Jobs }, "Jobs"],
  });

  const handleCleanUpClicked = () => doCleanUp();

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

  if (fetchingJobs) 
    loadingElement = <>Loading</>;

  if (jobFetchingError) 
    errorElement = <>Error</>;

  if (!(fetchingJobs && jobFetchingError)) 
    jobElements = jobs.map(j =>
      <Grid item xs={12} key={j.id}>
        <Item job={j}/>
      </Grid>
    );
  
  const cleanUpIcon = cleanUpThunk?.loading ? <CircularProgress /> : <Delete />;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button startIcon={cleanUpIcon} variant="outlined" onClick={handleCleanUpClicked} disabled={cleanUpThunk?.loading}>
          Clean-up
        </Button>
      </Grid>
      {loadingElement}
      {errorElement}
      {jobElements}
    </Grid>
  );
};
