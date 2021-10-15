import { Job } from "../model/Job";
import { Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";

interface Props {
  job: Job
}

export const Item:FunctionComponent<Props> = (props) => {
  const { job } = props;
  return (
    <Typography>
      {job.metadata.title}
    </Typography>
  );
};
