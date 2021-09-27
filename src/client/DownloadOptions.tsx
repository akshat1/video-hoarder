import { YTMetadata } from "../model/YouTube";
import { FormatSelector } from "./FormatSelector";
import { Thumbnail } from "./Thumbnail";
import { Accordion, AccordionDetails, AccordionSummary, Container, Grid, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ansiHTML from "ansi-to-html";
import React, { FunctionComponent, useState } from "react";

const useStyle = makeStyles((theme: Theme) => ({
  root: {},
  thumbnail: {
    maxWidth: "100%",
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
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary>
              <Typography variant="h5">Description</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography dangerouslySetInnerHTML={toHTML(metadata.description)} />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid container item xs={12} md={6}>
          <Grid item xs={12} md={6}>
            Formats
          </Grid>
          <Grid item xs={12} md={6}>
            <FormatSelector
              formats={formats}
              value={format.formatId}
              onChange={setFormat}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            Subtitles
          </Grid>
          <Grid item xs={12} md={6}>
            Subtitle Selection
          </Grid>
          <Grid item xs={12} md={6}>
            Post-processing
          </Grid>
          <Grid item xs={12} md={6}>
            Post config
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
