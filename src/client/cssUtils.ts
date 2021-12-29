import { Theme } from "@mui/material";
import { CSSProperties } from "@mui/styles";

interface Options {
  alignItems: string;
}

export const infoTable = (theme: Theme, options?: Options): CSSProperties => ({
  alignItems: options?.alignItems || "baseline",
  display: "grid",
  columnGap: theme.spacing(1),
  gridTemplateColumns: "max-content 1fr",
});
