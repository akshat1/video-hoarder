
import { Theme } from "@mui/material";
import { CSSProperties } from "@mui/styles";
import _ from "lodash";

interface Options {
  alignItems?: string;
  columnGap?: number;
  justifyItems?: string;
  rowGap?: number;
}

export const infoTable = (theme: Theme, options?: Options): CSSProperties => ({
  alignItems: options?.alignItems || "baseline",
  columnGap: theme.spacing(_.get(options, "columnGap", 1)),
  display: "grid",
  gridTemplateColumns: "max-content 1fr",
  justifyItems: options?.justifyItems || "baseline",
  rowGap: theme.spacing(_.get(options, "rowGap", 0)),
});

export const verticalFlexBox = (): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
});

export const horizontalFlexBox = (): CSSProperties => ({
  display: "flex",
  flexDirection: "row",
});

const ToolbarSXStub: CSSProperties = {
  display: "flex",
  alignItems: "center",
  borderRadius: 1,
  "& svg": { m: 1.5 },
  "& hr": { mx: 0.5 },
};
export const toolbar = (theme: Theme): CSSProperties => ({
  ...ToolbarSXStub,
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  columnGap: theme.spacing(2),
  background: theme.palette.background.paper,
  color: theme.palette.text.secondary,
});
