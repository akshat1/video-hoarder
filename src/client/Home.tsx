import { DownloadOptionsInput } from "../model/Job";
import { YTMetadata } from "../model/YouTube";
import { DownloadOptions } from "./DownloadOptions";
import { Mutation, Query } from "./gql";
import { InputForm } from "./InputForm";
import { ItemList } from "./ItemList";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Collapse, Theme  } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import _ from "lodash";
import React, { ChangeEventHandler, Fragment, FunctionComponent, useEffect, useState } from "react";

const InputPattern = "^(https?:\\/\\/.+)$";
const isValidURL = (url: string): boolean => new RegExp(InputPattern).test(url);

const useStyle = makeStyles((theme: Theme) => ({
  metadataContainer: {
    marginTop: theme.spacing(2),
  },
}));

export const Home:FunctionComponent = () => {
  const classes = useStyle();
  const [url, setURL] = useState("");
  const [downloadOptions, setDownloadOptions] = useState<DownloadOptionsInput|null>(null);
  const isValid = isValidURL(url);
  const [fetchMetadata, metadataThunk] = useLazyQuery(Query.MetadataAndOptions);
  const [doAddJob, addJobThunk] = useMutation(Mutation.AddJob);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    if (url && metadata) {
      await doAddJob({
        variables: {
          data: {
            url: url,
            downloadOptions,
          },
        },
      });
      clearURL();
    }
  };

  const clearURL = () => {
    setURL("");
    setDownloadOptions(null);
  }

  const debouncedFetchMetadata = _.debounce((ytURL) => {
    if (ytURL) {
      fetchMetadata({
        variables: { url: ytURL },
      });
    }
  }, 250);

  const onInputURLChange:ChangeEventHandler<HTMLInputElement> = (event) => {
    setURL(event.currentTarget.value);
    debouncedFetchMetadata(event.currentTarget.value);
  };

  let metadata:(YTMetadata | null) = null;
  const {
    loading: fetchingMetadata,
    data: metadataResponse,
  } = metadataThunk;
  if (url && !fetchingMetadata) {
    console.log("metadataResponse", metadataResponse);
    metadata  = _.get(metadataResponse, "metadataAndOptions.metadata", null);
  }

  useEffect(() => {
    const optionsResponse = _.get(metadataResponse, "metadataAndOptions.downloadOptions", null);
    const newOptions = optionsResponse ? _.pick(
      optionsResponse,
      "formatSelector", "rateLimit", "downloadLocation"
    ) : null;
    // apollo adds __typename to downloaded object, and complains if you send the same property back since it's
    // not part of the schema that's why I'm using _.pick instead of simply using response.downloadOptions.
    console.log("New options: ", newOptions);
    setDownloadOptions(newOptions);
  }, [metadataResponse]);

  return (
    <Fragment>
      <InputForm
        onChange={onInputURLChange}
        onSubmit={onSubmit}
        valid={isValid}
        url={url}
        clearURL={clearURL}
        busy={metadataThunk.loading || addJobThunk.loading}
      />
      <Collapse in={!!metadata} className={classes.metadataContainer}>
        {downloadOptions && metadata && <DownloadOptions options={downloadOptions} metadata={metadata} onChange={setDownloadOptions}/>}
      </Collapse>
      <Collapse in={!metadata}>
        <ItemList />
      </Collapse>
    </Fragment>
  );
};
