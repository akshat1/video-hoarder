import { RateUnlimited } from "../model/Job";
import { Autocomplete, TextField } from "@mui/material";
import React, { FunctionComponent, SyntheticEvent } from "react";

const RateOptions = [
  RateUnlimited,
  "1M",
  "500K",
  "250K",
  "100K",
  "1K",
];

interface Props {
  onChange: (event: SyntheticEvent, newValue: any) => void;
  value: string;
}

export const DownloadRateInput: FunctionComponent<Props> = (props) => {
  const {
    value,
    onChange,
  } = props;

  const renderRateLimitInput = (params) => (
    <TextField
      {...params}
      variant="standard"
      InputProps={{
        ...params.InputProps,
      }}
    />
  );

  return (
    <Autocomplete
      freeSolo
      value={value}
      onChange={onChange}
      id="download-rate-limit"
      options={RateOptions}
      renderInput={renderRateLimitInput}
      placeholder="Unlimited"
    />
  );
};
