import { DownloadOptionsInput, RateUnlimited } from "../model/Job";
import { YTFormat, YTMetadata } from "../model/YouTube";
import { infoTable } from "./cssUtils";
import { DownloadRateInput } from "./DownloadRateInput";
import { FormatSelector } from "./FormatSelector";
import { Query } from "./gql";
import { Thumbnail } from "./Thumbnail";
import { useQuery } from "@apollo/client";
import { Grid, Link, makeStyles,Theme, Typography } from "@material-ui/core";
import _ from "lodash";
import React, { ChangeEvent, FunctionComponent } from "react";

export const DefaultOptions:DownloadOptionsInput = {
  formatSelector: YTFormat.BestBestMerged.formatId,
  rateLimit: RateUnlimited,
};

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
  url: string;
}

export const DownloadOptions:FunctionComponent<Props> = (props) => {
  const {
    onChange,
    options,
    url,
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

  if (url) {
    const metadataThunk = url ? useQuery(Query.YTMetadata, { variables: { url }}) : null;
    const metadata = _.get(metadataThunk, "data.ytMetadata", null) as YTMetadata|null;
    if (metadata) {
      return (
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={12}>
            <Typography variant="h4">{metadata.title}</Typography>
          </Grid>
          <Grid item sm={12} md={8}className={classes.dlOptions}>
            <Typography>Download format</Typography>
            <FormatSelector
              url={url}
              value={options.formatSelector}
              onChange={onFormatChange}
            />
            <Typography>Download Rate Limit</Typography>
            <DownloadRateInput value={options.rateLimit} onChange={onRateLimitChange}/>
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
    }
  }

  return null;
};
