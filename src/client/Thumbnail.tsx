import { YTThumbnail } from "../model/YouTube";
import React, { FunctionComponent } from "react";

interface ThumbnailProps {
  thumbnails: YTThumbnail[],
  fallback: string,
  className?: string,
}

const getSrcSet = (thumbs:YTThumbnail[]):string =>
  YTThumbnail.sortByResolution(thumbs).map((thumb:YTThumbnail) => `${thumb.url} ${thumb.width}w`).join(", ");

export const Thumbnail:FunctionComponent<ThumbnailProps> = (props) =>
  <img srcSet={getSrcSet(props.thumbnails)} src={props.fallback} className={props.className}/>;
