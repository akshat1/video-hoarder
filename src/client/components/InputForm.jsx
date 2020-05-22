/**
 * This component renders the URL input form and comprises a text input for the URL, a submit
 * button, a clear button, and appropriate error messages for the URL pattern validation.
 *
 * While this component does accept an `initialValue` prop, I don't really foresee a use for it at
 * the moment. The component is meant to send information only outwards through the `onSubmit`
 * prop.
 *
 * @module client/components/InputForm
 */
import { addJob } from "../redux/actions";
import { Button, Container, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput,  } from "@material-ui/core";
import { ClearOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
//  import * as Style from "./InputForm.less";

const useStyle = makeStyles(theme => ({
  submitContainer: {
    textAlign: "center"
  },
  submitButton: {
    [theme.breakpoints.up("md")]: {
      marginTop: "11px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  }
}));

const InputPattern = "^(https?:\\/\\/.+)?$";
export const InputForm = ({ initialValue, onSubmit }) => {
  const classes = useStyle();
  const [url, setURL] = useState(initialValue);
  useEffect(() => setURL(initialValue), [initialValue]);
  const onChange = e => setURL(e.currentTarget.value);
  const clearURL = () => setURL("");
  const isInvalid = !new RegExp(InputPattern).test(url);
  const validationErrorMessage = isInvalid ? "Invalid URL" : null;
  const isSubmitDisabled = url ? isInvalid : true;
  console.log(`!!url? ${Boolean(url)} // url? ${url} // isInvalid? ${isInvalid} // isSubmitDisabled? ${isSubmitDisabled}`);
  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!isInvalid) onSubmit(url);
  }

  const clearButton = (
    <InputAdornment position="end">
      <IconButton
        aria-label="clear"
        onClick={clearURL}
      >
        <ClearOutlined />
      </IconButton>
    </InputAdornment>
  );

  return (
    <Container>
      <form onSubmit={onFormSubmit}>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={10}>
          <FormControl
            fullWidth
            variant="outlined"
            required
            helperText={validationErrorMessage}
          >
            <InputLabel htmlFor="url-input">Enter URL</InputLabel>
            <OutlinedInput
              id="url-input"
              onChange={onChange}
              value={url}
              endAdornment={clearButton}
              labelWidth={90}
              error={isInvalid}
            />
            <FormHelperText id="url-error-text">{validationErrorMessage}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md xs={12} className={classes.submitContainer}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitDisabled}
            className={classes.submitButton}
          >
            Download
          </Button>
        </Grid>
      </Grid>  
      </form>
    </Container>
  );
}

InputForm.propTypes = {
  /**
   * @function
   * @param {string} url
   */
  onSubmit: PropTypes.func.isRequired,
  /** @type {string} */
  initialValue: PropTypes.string,
};

InputForm.defaultProps = {
  initialValue: ""
};

const stateToProps = () => ({});
const dispatchToProps = { onSubmit: addJob };
export default connect(stateToProps, dispatchToProps)(InputForm);
