import { RateUnlimited } from "../model/Job";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { ChangeEvent, FunctionComponent } from "react";

const RateOptions = [
  RateUnlimited,
  "1M",
  "500K",
  "250K",
  "100K",
  "1K",
];

interface Props {
  onChange: (event: ChangeEvent, newValue: any) => void;
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
      InputProps={{
        ...params.InputProps,
        type: "search",
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
    />
  );
};
