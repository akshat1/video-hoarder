import { YTThumbnail } from "../model/YouTube";
import { makeStyles } from "@mui/styles";
import React, { FunctionComponent } from "react";

const useStyle = makeStyles(() => ({
  root: {
    width: "100%",
  },
}));

interface ThumbnailProps {
  thumbnails: YTThumbnail[],
  fallback: string,
  className?: string,
}

const getSrcSet = (thumbs:YTThumbnail[]):string =>
  YTThumbnail.sortByResolution(thumbs).map((thumb:YTThumbnail) => `${thumb.url} ${thumb.width}w`).join(", ");

export const Thumbnail:FunctionComponent<ThumbnailProps> = (props) => {
  const classes = useStyle();
  return (
    <img
      srcSet={getSrcSet(props.thumbnails)}
      src={props.fallback}
      className={`${props.className} ${classes.root}`}
    />
  );
};
