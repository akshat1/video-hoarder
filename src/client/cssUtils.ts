import { Theme } from "@material-ui/core";
import { CSSProperties } from "@material-ui/styles";

export const infoTable = (theme: Theme): CSSProperties => ({
  alignItems: "baseline",
  display: "grid",
  columnGap: `${theme.spacing(1)}px`,
  gridTemplateColumns: "max-content 1fr",
});
