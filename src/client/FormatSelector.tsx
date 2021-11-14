import { YTFormat, YTMetadata } from "../model/YouTube";
import { Query } from "./gql";
import { useQuery } from "@apollo/client";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import _ from "lodash";
import React, { ChangeEvent, FunctionComponent } from "react";

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
  url: string;
  value: string;
  onChange?: (event: React.ChangeEvent<{ name?: string; value: string }>, child: React.ReactNode) => void;
}

export const FormatSelector:FunctionComponent<Props> = (props) => {
  const {
    onChange,
    url,
    value,
  } = props;

  const metadataThunk = url ? useQuery(Query.YTMetadata, { variables: { url } }) : {};
  const metadata = _.get(metadataThunk, "data.ytMetadata", null) as YTMetadata|null;
  
  if (metadata) {
    const options = getFormatOptions();
    const menuItems = options.map(({ format, formatId }) =>
      <MenuItem value={formatId} key={formatId}>{format}</MenuItem>
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
  }

  return null;
};
