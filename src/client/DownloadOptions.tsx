import { YTMetadata } from "../model/YouTube";
import { FormatSelector } from "./FormatSelector";
import { Thumbnail } from "./Thumbnail";
import { Container, Grid, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ansiHTML from "ansi-to-html";
import React, { ChangeEvent, FunctionComponent, useState } from "react";

const useStyle = makeStyles((theme: Theme) => ({
  root: {},
  thumbnail: {
    maxWidth: "100%",
  },
  options: {
    alignItems: "center",
  },
}));

const convert = new ansiHTML({
  newline: true,
});

const toHTML = text => ({
  __html: convert.toHtml(text),
});

interface DownloadOptionsProps {
  metadata: YTMetadata;
}

export const DownloadOptions:FunctionComponent<DownloadOptionsProps> = (props) => {
  const { metadata } = props;
  console.log("Metadata:", metadata);
  const formats = YTMetadata.getFormatsForUI(metadata);
  console.log("Formats:", formats);
  const [format, setFormat] = useState(formats[0]);
  const onFormatChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    setFormat(formats.find(f => f.formatId === event.target.value));
  }

  const classes = useStyle();

  console.log("metadata:", metadata);

  return (
    <Container className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">{metadata.title}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Thumbnail
            thumbnails={metadata.thumbnails}
            fallback={metadata.thumbnail}
            className={classes.thumbnail}
          />
        </Grid>
        <Grid container item xs={12} spacing={3} className={classes.options}>
          <Grid item>
            <Typography variant="h6">Download format</Typography>
          </Grid>
          <Grid>
            <FormatSelector
              formats={formats}
              value={format?.formatId}
              onChange={onFormatChange}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Description</Typography>
          <Typography dangerouslySetInnerHTML={toHTML(metadata.description)} />
        </Grid>
      </Grid>
    </Container>
  );
};
