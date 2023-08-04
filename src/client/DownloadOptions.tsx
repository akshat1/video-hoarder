import { useQuery } from "@apollo/client";
import { DownloadOptionsInput } from "../model/Job";
import { YTMetadata } from "../model/YouTube";
import { infoTable } from "./cssUtils";
import PresetSelector from "./PresetSelector";
import { Thumbnail } from "./Thumbnail";
import { Grid, Link, SelectChangeEvent, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FunctionComponent, SyntheticEvent } from "react";
import { GetPresets } from "./gql/preset";

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    alignItems: "start",
  },
  thumbnail: {
    maxWidth: "100%",
  },
  meta: {
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  tableGrid: infoTable(theme),
  dlOptions: {
    marginTop: theme.spacing(1),
  },
}));

interface Props {
  onChange: (options: DownloadOptionsInput) => void;
  options: DownloadOptionsInput,
  metadata: YTMetadata,
}

export const DownloadOptions:FunctionComponent<Props> = (props) => {
  const {
    onChange,
    options,
    metadata,
  } = props;

  const classes = useStyle();

  // Temporarily, we obtain a list of presets from the server in order to set a default preset value. Eventually, we
  // will have a matching preset will be returned as part of download metadata from the server.
  const { loading, error, data } = useQuery(GetPresets);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h4">{metadata.title}</Typography>
      </Grid>
      <Grid item sm={12} md={8} className={classes.dlOptions}>
        <PresetSelector value={data.presets[0]?.id} />
      </Grid>
      <Grid item sm={12} md={4} className={classes.meta}>
        <Thumbnail
          thumbnails={metadata.thumbnails}
          fallback={metadata.thumbnail}
          className={classes.thumbnail}
        />
        <div className={classes.tableGrid}>
          <Typography>Channel</Typography>
          <Typography><Link href={metadata.channelUrl}>{metadata.channel}</Link></Typography>
          <Typography>Uploaded</Typography>
          <Typography>{new Date(metadata.uploadDate).toLocaleDateString(Intl.NumberFormat().resolvedOptions().locale, { year: "numeric", month: "long", day: "numeric" })}</Typography>
        </div>
      </Grid>
    </Grid>
  );
};
