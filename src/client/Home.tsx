import { YTMetadata } from "../model/YouTube";
import { DownloadOptions } from "./DownloadOptions";
import { Query } from "./gql";
import { InputForm } from "./InputForm";
import { ItemList } from "./ItemList";
import { useLazyQuery } from "@apollo/client";
import { Collapse, Theme  } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import _ from "lodash";
import React, { ChangeEventHandler, Fragment, FunctionComponent, useEffect,useState } from "react";

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
  const isValid = isValidURL(url);
  const [fetchMetadata, metadataThunk] = useLazyQuery(Query.YTMetadata);

  const onSubmit = () => console.log("Add New form submitted");
  const clearURL = () => setURL("");

  const {
    loading: fetchingMetadata,
    data: metadataResponse,
  } = metadataThunk;
  const metadata:(YTMetadata | null) = (url && !fetchingMetadata) ? metadataResponse?.ytMetadata : null;
  const debouncedFetchMetadata = _.debounce((ytURL) => {
    if (ytURL) {
      fetchMetadata({ variables: { url: ytURL }});
    }
  }, 250);

  const onInputURLChange:ChangeEventHandler<HTMLInputElement> = (event) => {
    setURL(event.currentTarget.value);
    debouncedFetchMetadata(event.currentTarget.value);
  };

  useEffect(() => {
    /// @ts-ignore
    onInputURLChange(_.set({}, "currentTarget.value", "https://www.youtube.com/watch?v=qGLSoME2-us"));
  }, []);

  return (
    <Fragment>
      <InputForm
        onChange={onInputURLChange}
        onSubmit={onSubmit}
        valid={isValid}
        url={url}
        clearURL={clearURL}
        busy={metadataThunk.loading}
      />
      <Collapse in={!!metadata} className={classes.metadataContainer}>
        {metadata && <DownloadOptions metadata={metadata} />}
      </Collapse>
      <Collapse in={!metadata}>
        <ItemList />
      </Collapse>
    </Fragment>
  );
};
