import { YTDLInformation } from "../model/YTDL";
import { infoTable } from "./cssUtils";
import { Query } from "./gql";
import { useQuery } from "@apollo/client";
import { CircularProgress, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FunctionComponent } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    ...infoTable(theme),
  },
}));

/* QueryResponse.data has en extra level of nesting. Because y not. */
interface YTDLInformationData {
  ytdlInformation: YTDLInformation;
}

export const YTDLSettings:FunctionComponent = () => {
  const classes = useStyles();
  const {
    data,
    loading: fetchingInformation,
    error: informationFetchingError,
  } = useQuery<YTDLInformationData>(Query.YTDLInformation);

  let output = null; // oooh how I miss jsx conditionals.
  if (fetchingInformation) {
    output = <CircularProgress />;
  } else if (data?.ytdlInformation && !(fetchingInformation || informationFetchingError)) {
    const {
      executable,
      version,
    } = data.ytdlInformation;
    output = (
      <>
        <Typography>Executable</Typography>
        <Typography>{executable}</Typography>
        <Typography>Version</Typography>
        <Typography>{version}</Typography>
      </>
    );
  }

  return (
    <div className={classes.root}>
      {output}
    </div>
  );
};
