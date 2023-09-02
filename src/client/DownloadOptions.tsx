// TODO: Hookup onChange to update presetId on the parent.

import { DownloadOptionsInput } from "../model/Job";
import { Preset } from "../model/Preset";
import { YTMetadata } from "../model/YouTube";
import { getLogger } from "../shared/logger";
import { infoTable } from "./cssUtils";
import { Query } from "./gql";
import { GetPresets } from "./gql/preset";
import { PresetInformation } from "./PresetInformation";
import { PresetSelector } from "./PresetSelector";
import { Thumbnail } from "./Thumbnail";
import { useQuery } from "@apollo/client";
import { Grid, Link, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { FunctionComponent, useEffect, useState } from "react";

const logger = getLogger("DownloadOptions");

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
  tableGrid: infoTable(theme, { alignItems: "end" } ),
  dlOptions: {
    marginTop: theme.spacing(1),
  },
}));
 
interface Props {
  videoURL: string;
  onChange: (options: DownloadOptionsInput) => void;
}

export const DownloadOptions:FunctionComponent<Props> = (props) => {
  const classes = useStyle();
  const { videoURL } = props;
  
  const {
    loading: loadingMetadata,
    error: metadataError,
    data: metadataResponse,
  } = useQuery<{ metadata: YTMetadata }>(Query.YTMetadata, { variables: { url: videoURL } });
  const metadata = metadataResponse?.metadata;

  const {
    loading: loadingPresets,
    error: presetsError,
    data: presetsResponse,
  } = useQuery<{ presets: Preset[] }>(GetPresets);

  const [preset, setPreset] = useState<Preset>();
  useEffect(() => setPreset(presetsResponse?.presets[0]), [presetsResponse]);
  const presetSelectorEl = preset ? <PresetSelector presets={presetsResponse?.presets} value={preset} onChange={setPreset}/> : null;

  if (loadingPresets || loadingMetadata) return <p>Loading...</p>;
  if (presetsError || metadataError) return <p>Error :(</p>;
  if (!metadata) return <p>No Metadata</p>;

  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h4">{metadata.title}</Typography>
      </Grid>
      <Grid item sm={12} md={8} className={classes.dlOptions}>
        <div className={classes.tableGrid}>
          <Typography>Preset</Typography>
          {presetSelectorEl}
          <PresetInformation preset={preset} />
        </div>
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
