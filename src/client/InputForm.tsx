import { Button, CircularProgress, Container, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Theme } from "@material-ui/core";
import { ClearOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import React, { ChangeEventHandler, FormEventHandler, FunctionComponent, MouseEventHandler } from "react";

// const parseSearch = (search: string): Record<string, string> => {
//   const queryString = search.substr(1);
//   const dict = {};
//   // The following code doesn't handle query params with array values (foo=bar&foo=baz) but that
//   // doesn't matter to us.
//   queryString
//     .split("&")
//     .map(pair => pair.split("="))
//     .forEach(([key, value]) => dict[key] = value);
//   return dict;
// };

interface ClearButtonProps {
  clearURL: MouseEventHandler<HTMLInputElement>;
  busy: boolean;
}
const ClearButton:FunctionComponent<ClearButtonProps> = ({ clearURL, busy }) => (
  <InputAdornment position="end">
    {busy ? <CircularProgress /> : null}
    <IconButton
      aria-label="clear"
      onClick={clearURL}
    >
      <ClearOutlined />
    </IconButton>
  </InputAdornment>
);

const useStyle = makeStyles((theme: Theme) => ({
  root: {},
  submitContainer: {
    textAlign: "center",
  },
  submitButton: {
    [theme.breakpoints.up("md")]: {
      marginTop: "11px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));

interface InputFormProps {
  busy: boolean;
  clearURL: MouseEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>
  onSubmit: FormEventHandler<HTMLFormElement>;
  url: string;
  valid: boolean;
}

export const InputForm:FunctionComponent<InputFormProps> = (props) => {
  const {
    busy,
    clearURL,
    onChange,
    onSubmit,
    url,
    valid,
  } = props;
  const classes = useStyle();
  const validationErrorMessage = url && !valid ? "Invalid URL" : null;
  const isSubmitDisabled = !valid;

  const clearButton = <ClearButton clearURL={clearURL} busy={busy}/>
  return (
    <Container className={classes.root}>
      <form onSubmit={onSubmit}>
        <Grid
          alignItems="stretch"
          container
          spacing={3}
        >
          <Grid
            item
            md={10}
            xs={12}
          >
            <FormControl
              fullWidth
              required
              variant="outlined"
            >
              <InputLabel htmlFor="url-input">Enter URL</InputLabel>
              <OutlinedInput
                onChange={onChange}
                endAdornment={clearButton}
                value={url}
                error={Boolean(url && !valid)}
              />
              <FormHelperText id="url-error-text">{validationErrorMessage}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            className={classes.submitContainer}
            item
            md
            xs={12}
          >
            <Button
              className={classes.submitButton}
              color="primary"
              disabled={isSubmitDisabled}
              type="submit"
              variant="contained"
            >
              Download
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};
