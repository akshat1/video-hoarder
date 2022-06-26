import { DownloadOptionsInput } from "../model/Job";
import { YTMetadata } from "../model/YouTube";
import { getLogger } from "../shared/logger";
import { DownloadOptions } from "./DownloadOptions";
import { Mutation, Query } from "./gql";
import { InputForm } from "./InputForm";
import { ItemList } from "./ItemList";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Collapse, Theme  } from "@mui/material";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import React, { ChangeEventHandler, Fragment, FunctionComponent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const logger = getLogger("Home");
const InputPattern = "^(https?:\\/\\/.+)$";
const isValidURL = (url: string): boolean => new RegExp(InputPattern).test(url);

const searchToDict = search =>
  search
    .substr(1)
    .split("&")
    .map(t => t.split("="))
    .reduce((hash, pair) => ({
      ...hash,
      [pair[0]]: pair[1],
    }), {});

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

  const { search } = useLocation();
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
    if (ytURL) 
      fetchMetadata({
        variables: { url: ytURL },
      });
    
  }, 250);

  const onInputURLChange:ChangeEventHandler<HTMLInputElement> = (event) => {
    setURL(event.currentTarget.value);
    debouncedFetchMetadata(event.currentTarget.value);
  };

  useEffect(() => {
    const query = searchToDict(search);
    logger.debug("search:", search);
    logger.debug("query:", JSON.stringify(query, null, 2));
    let sharedURL = "";
    try {
      sharedURL = query.text ? new URL(decodeURIComponent(query.text)).toString() : "";
      if (sharedURL) {
        logger.debug("We have a sharedURL. Try to fetch metadata.");
        setURL(sharedURL);
        debouncedFetchMetadata(sharedURL);
      }
    } catch (err) {
      // we probably don't have a URL, or a malformed one. Carry on as if no URL was shared.
    }
  }, []);

  let metadata:(YTMetadata | null) = null;
  const {
    loading: fetchingMetadata,
    data: metadataResponse,
  } = metadataThunk;
  if (url && !fetchingMetadata) {
    logger.debug("metadataResponse", metadataResponse);
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
