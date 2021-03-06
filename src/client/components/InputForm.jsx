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
import { addJob } from "../redux/job-management";
import { clearQuery } from "../redux/navigation";
import { getTargetURL } from "../selectors";
import { Button, Container, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput  } from "@material-ui/core";
import { ClearOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const useStyle = makeStyles(theme => ({
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

const InputPattern = "^(https?:\\/\\/.+)?$";
export const InputForm = ({ className, clearQuery, initialValue, onSubmit }) => {
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
    if (!isInvalid) {
      onSubmit(url);
      clearQuery();
    }
    clearURL();
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
    <Container className={className}>
      <form onSubmit={onFormSubmit}>
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
              endAdornment={clearButton}
              error={isInvalid}
              id="url-input"
              labelWidth={90}
              onChange={onChange}
              value={url}
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
}

InputForm.propTypes = {
  /**
   * @function
   * @param {string} url
   */
  onSubmit: PropTypes.func.isRequired,
  /** @type {string} */
  initialValue: PropTypes.string,
  className: PropTypes.string,
  clearQuery: PropTypes.func.isRequired,
};

InputForm.defaultProps = {
  initialValue: "",
};

const stateToProps = (state) => ({
  initialValue: getTargetURL(state),
});
const dispatchToProps = {
  onSubmit: addJob,
  clearQuery,
};
export default connect(stateToProps, dispatchToProps)(InputForm);
