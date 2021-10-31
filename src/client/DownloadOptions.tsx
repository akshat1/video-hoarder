import { YTMetadata } from "../model/YouTube";
import { infoTable } from "./cssUtils";
import { FormatSelector } from "./FormatSelector";
import { Thumbnail } from "./Thumbnail";
import { Grid, Link, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { ChangeEvent, FunctionComponent, useState } from "react";

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
    ...infoTable(theme),
    marginTop: theme.spacing(1),
  },
}));

interface DownloadOptionsProps {
  metadata: YTMetadata;
}

export const DownloadOptions:FunctionComponent<DownloadOptionsProps> = (props) => {
  const { metadata } = props;
  const formats = YTMetadata.getFormatsForUI(metadata);
  const [format, setFormat] = useState(formats[0]);
  const onFormatChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    setFormat(formats.find(f => f.formatId === event.target.value));
  }
  const classes = useStyle();

  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h4">{metadata.title}</Typography>
      </Grid>
      <Grid item sm={12} md={8}className={classes.dlOptions}>
        <Typography>Download format</Typography>
        <FormatSelector
          formats={formats}
          value={format?.formatId}
          onChange={onFormatChange}
        />
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
