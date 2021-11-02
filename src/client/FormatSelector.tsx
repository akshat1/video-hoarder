import { YTFormat } from "../model/YouTube";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import React, { FunctionComponent } from "react";

interface Props {
  value: string;
  formats: YTFormat[];
  onChange: (YTFormat) => void;
}

export const FormatSelector:FunctionComponent<Props> = (props) => {
  const {
    value,
    formats,
    onChange,
  } = props;
  const menuItems = (formats || []).map(f =>
    <MenuItem value={f.formatId} key={f.formatId}>{f.format}</MenuItem>
  );

  return (
    <FormControl>
      <Select
        value={value}
        onChange={onChange}
      >
        {menuItems}
      </Select>
    </FormControl>
  );
};