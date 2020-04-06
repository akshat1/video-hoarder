/**
 * This component renders the URL input form and comprises a text input for the URL, a submit
 * button, a clear button, and appropriate error messages for the URL pattern validation.
 *
 * While this component does accept an `initialValue` prop, I don't really foresee a use for it at
 * the moment. The component is meant to send information only outwards through the `onSubmit`
 * prop.
 *
 * @module src/client/components/InputForm
 */
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import classNames from "classnames";
import * as Style from "./InputForm.less";

const InputPattern = /^(https?:\/\/.+)?$/;

const getInputStyleClass = invalid => {
  return classNames(Style.input, { [Style.invalid]: invalid });
}

const InputForm = ({ initialValue, onSubmit }) => {
  const [url, setURL] = useState(initialValue);
  useEffect(() => setURL(initialValue), [initialValue]);
  const onChange = e => setURL(e.currentTarget.value);
  const isInvalid = !InputPattern.test(url);
  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!isInvalid) onSubmit(url);
  }

  const onClear = (e) => {
    e.preventDefault();
    setURL('');
  }

  return (
    <div className={Style.wrapper}>
      <form onSubmit={onFormSubmit} className={Style.form}>
        <input
          title="Enter the URL of the video here"
          type="url"
          placeholder="Enter the URL of the video here"
          className={getInputStyleClass(isInvalid)}
          onChange={onChange}
          id="urlInput"
          value={url}
          spellCheck={false}
          required
        />
        <button
          className={Style.clear}
          onClick={onClear}
          title="Clear"
          role="button"
          disabled={!url}
        >
          <span>+</span>
        </button>
        <If condition={isInvalid}>
          <label className={Style.errorMessage} id="inp-err-mobile">Please enter a valid URL.</label>
        </If>
        <button
          className={Style.submit}
          type="submit"
          role="button"
          title="Submit URL for download"
          disabled={isInvalid || !url}
        >
          Download
        </button>
      </form>
    </div>
  );
};

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
  initialValue: ''
};

export default InputForm;

/*
<div className={Style.inputContainer}>
          
          
        </div>
        <If condition={isInvalid}>
          <label className={Style.errorMessageDesktop} id="inp-err-desktop">Please enter a valid URL.</label>
        </If>
*/
