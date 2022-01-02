import { Job, JobStatus } from "../model/Job";
import { infoTable } from "./cssUtils";
import { Mutation } from "./gql";
import { JobProgress } from "./JobProgress";
import { Thumbnail } from "./Thumbnail";
import { useMutation } from "@apollo/client";
import { Button, Paper, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import React, { FunctionComponent } from "react";

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: `${theme.spacing(1)} ${theme.spacing(1)}`,
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "33% 1fr",
    },
  },
  thumbnail: {},
  thumbNailImage: {
    verticalAlign: "bottom",
  },
  notThumbnail: {
    padding: theme.spacing(1),
    display: "grid",
    gridTemplateRows: "min-content 1fr min-content",
    alignItems: "baseline",
  },
  title: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "99.99%",
  },
  tableGrid: infoTable(theme),
  controls: {},
  progress: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  job: Job
}

export const Item:FunctionComponent<Props> = (props) => {
  const { job } = props;
  const classes = useStyle();

  const [
    doCancelJob, {
      error: cancellationError,
      loading: cancelling,
    },
  ] = useMutation(Mutation.CancelJob);
  const onCancel = () =>
    doCancelJob({
      variables: {
        jobId: job.id,
      },
    });

  const [
    doRemoveJob, {
      error: removalError,
      loading: removing,
    },
  ] = useMutation(Mutation.RemoveJob);
  const onRemove = () =>
    doRemoveJob({
      variables: {
        jobId: job.id,
      },
    });

  let updatedElem = null;
  if (job.updatedAt) {
    updatedElem = (
      <>
        <Typography>Last updated</Typography>
        <Typography>{new Date(job.updatedAt).toLocaleString(Intl.NumberFormat().resolvedOptions().locale)}</Typography>
      </>
    );
  }

  const opButtons = [];
  if (job.status === JobStatus.Pending || job.status === JobStatus.InProgress) {
    opButtons.push(
      <Button
        size="small"
        variant="outlined"
        onClick={onCancel}
        disabled={Boolean(cancelling || cancellationError)}
        key={`${job.id}--cancel`}
      >
        Cancel
      </Button>
    );
  }

  if (job.status === JobStatus.Canceled || job.status === JobStatus.Completed || job.status === JobStatus.Failed) {
    opButtons.push(<Button
      size="small"
      variant="outlined"
      onClick={onRemove}
      disabled={Boolean(removing || removalError)}
      key={`${job.id}--remove`}
    >
      Remove
    </Button>);
  }

  return (
    <Paper variant="outlined" className={classes.root}>
      <div className={classes.thumbnail}>
        <Thumbnail
          thumbnails={job.metadata.thumbnails}
          fallback={job.metadata.thumbnail}
          className={classes.thumbNailImage}
        />
      </div>
      <div className={classes.notThumbnail}>
        <Typography
          variant="h6"
          className={classes.title}
        >
          {job.metadata.title}
        </Typography>
        <div className={classes.tableGrid}>
          <Typography>Status</Typography>
          <Typography>{_.capitalize(job.status)}</Typography>
          <Typography>Download added</Typography>
          <Typography>{new Date(job.createdAt).toLocaleString(Intl.NumberFormat().resolvedOptions().locale)}</Typography>
          {updatedElem}
          <Typography>Format</Typography>
          <Typography>{_.get(job, "downloadOptions.formatSelector")}</Typography>
          <Typography>Rate limit</Typography>
          <Typography>{_.get(job, "downloadOptions.rateLimit")}</Typography>
          <Typography>Downloading to</Typography>
          <Typography>{_.get(job, "downloadOptions.downloadLocation")}</Typography>
        </div>
        <div className={classes.progress}>
          <JobProgress job={job} />
        </div>
        <div className={classes.controls}>
          {opButtons}          
        </div>
      </div>
    </Paper>
  );
};
