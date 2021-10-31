import { Job } from "../model/Job";
import { infoTable } from "./cssUtils";
import { Mutation } from "./gql";
import { Thumbnail } from "./Thumbnail";
import { useMutation } from "@apollo/client";
import { Button, makeStyles, Paper, Theme, Typography } from "@material-ui/core";
import _ from "lodash";
import React, { FunctionComponent } from "react";

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
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
}));

interface Props {
  job: Job
}

export const Item:FunctionComponent<Props> = (props) => {
  const { job } = props;
  const classes = useStyle();

  const [
    doRemoveJob, {
      error: abortError,
      loading: aborting,
    },
  ] = useMutation(Mutation.RemoveJob);
  const onAbort = () =>
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
        </div>
        <div className={classes.controls}>
          <Button
            size="small"
            variant="outlined"
            onClick={onAbort}
            disabled={Boolean(aborting || abortError)}
          >
            Abort
          </Button>
        </div>
      </div>
    </Paper>
  );
};
