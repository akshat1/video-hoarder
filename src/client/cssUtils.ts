
import { Theme } from "@mui/material";
import { CSSProperties } from "@mui/styles";
import _ from "lodash";

interface Options {
  alignItems?: string;
  columnGap?: number;
  rowGap?: number;
}

export const infoTable = (theme: Theme, options?: Options): CSSProperties => ({
  alignItems: options?.alignItems || "baseline",
  display: "grid",
  columnGap: theme.spacing(_.get(options, "columnGap", 1)),
  rowGap: theme.spacing(_.get(options, "rowGap", 0)),
  gridTemplateColumns: "max-content 1fr",
});

export const verticalFlexBox = (): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
});

export const horizontalFlexBox = (): CSSProperties => ({
  display: "flex",
  flexDirection: "row",
});
