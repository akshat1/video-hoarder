import { YTFormat } from "../model/YouTube";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { FunctionComponent } from "react";

/**
 * @todo check for existence of audio and video before adding respective BEST formats.
 * @todo add CUSTOM option and have the component display an advanced UI when selected.
 */
const getFormatOptions = (): YTFormat[] => {
  const result = [
    YTFormat.BestBestMerged,
    YTFormat.BestAudio,
    YTFormat.BestVideo,
  ];

  return result;
};

interface Props {
  value: string;
  onChange?: (event: SelectChangeEvent, child: React.ReactNode) => void;
}

export const FormatSelector:FunctionComponent<Props> = (props) => {
  const {
    onChange,
    value,
  } = props;

  const options = getFormatOptions();
  const menuItems = options.map(({ format, formatId }) =>
    <MenuItem value={formatId} key={formatId}>{format}</MenuItem>
  );

  return (
    <FormControl>
      <Select
        value={value}
        onChange={onChange}
        variant="standard"
      >
        {menuItems}
      </Select>
    </FormControl>
  );

  return null;
};
