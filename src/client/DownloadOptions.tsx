import { DownloadOptionsInput } from "../model/Job";
import { YTMetadata } from "../model/YouTube";
import { infoTable } from "./cssUtils";
import { DownloadRateInput } from "./DownloadRateInput";
import { FormatSelector } from "./FormatSelector";
import { Thumbnail } from "./Thumbnail";
import { Grid, Link, makeStyles,Theme, Typography } from "@material-ui/core";
import React, { ChangeEvent, FunctionComponent } from "react";

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
    ...infoTable(theme, { alignItems: "center" }),
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
  const onFormatChange = (event: ChangeEvent<{ name?: string, value: string }>) => {
    onChange({
      ...options,
      formatSelector: event.currentTarget.value,
    });
  };
  const onRateLimitChange = (event: ChangeEvent, newValue: any) => {
    onChange({
      ...options,
      rateLimit: newValue,
    });
  };

  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h4">{metadata.title}</Typography>
      </Grid>
      <Grid item sm={12} md={8}className={classes.dlOptions}>
        <Typography>Download format</Typography>
        <FormatSelector
          value={options.formatSelector}
          onChange={onFormatChange}
        />
        <Typography>Download rate limit</Typography>
        <DownloadRateInput value={options.rateLimit} onChange={onRateLimitChange}/>
        <Typography>Download location</Typography>
        <Typography>{options.downloadLocation}</Typography>
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
