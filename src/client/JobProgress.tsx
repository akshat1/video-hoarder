import { Job, JobStatus } from "../model/Job";
import { infoTable } from "./cssUtils";
import { LinearProgress, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";

const useStyle = makeStyles((theme: Theme) => ({
  root: {},
  inProgress: {
    color: theme.palette.grey[500],
  },
  data: infoTable(theme),
}));

interface Props {
  job: Job;
}

export const JobProgress:React.FunctionComponent<Props> = (props) => {
  const classes = useStyle();
  const { job } = props;

  if (job.status === JobStatus.InProgress && job.progress) {
    const {
      currentSpeed,
      eta,
      percent,
      totalSize,
    } = job.progress;
    

    return (
      <div className={classes.root}>
        <LinearProgress variant="determinate" value={percent}/>
        <div className={classes.data}>
          <Typography>Total Size</Typography>
          <Typography>{totalSize}</Typography>
          <Typography>Current Speed</Typography>
          <Typography>{currentSpeed}</Typography>
          <Typography>ETA</Typography>
          <Typography>{eta}</Typography>
        </div>
      </div>
    );
  } else if (job.status === JobStatus.Pending) {
    return (
      <div className={`${classes.root} ${classes.inProgress}`}>
        <LinearProgress />
      </div>
    );
  }

  // Don't render anything for completed or failed jobs.
  return null;
};
