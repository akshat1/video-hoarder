import { DownloadOptionsInput } from "../model/Job";
import { YTFormat, YTMetadata } from "../model/YouTube";
import { infoTable } from "./cssUtils";
import { FormatSelector } from "./FormatSelector";
import { Query } from "./gql";
import { Thumbnail } from "./Thumbnail";
import { useQuery } from "@apollo/client";
import { Grid, Link, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import _ from "lodash";
import React, { ChangeEvent, FunctionComponent, useState } from "react";

export const DefaultOptions:DownloadOptionsInput = {
  formatSelector: YTFormat.BestBestMerged.formatId,
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
    ...infoTable(theme),
    marginTop: theme.spacing(1),
  },
}));

interface Props {
  onChange: (DownloadOptionsInput) => void;
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
  const [formatSelector, setFormatSelector] = useState(options.formatSelector);
  const setOptions = _.debounce(() => {
    onChange({ formatSelector });
  }, 250);
  const onFormatChange = (event: ChangeEvent<{ name?: string, value: string }>) => {
    setFormatSelector(event.currentTarget.value);
    setOptions();
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
              value={formatSelector}
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
    }
  }

  return null;
};
