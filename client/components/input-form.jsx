import './input-form.less';
import { changeURL, submitTask } from '../redux/actions';
import { connect } from 'react-redux';
import { inputForm } from '../redux/selectors';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import React from'react';

const InputForm = ({ url, onFormSubmit, disabled, onUrlChanged, errorMessage }) =>
  <div className="input-form">
    <Form onSubmit={onFormSubmit}>
      <Form.Group>
        <Form.Label>Add a new download</Form.Label>
        <Form.Control
          disabled={disabled}
          name="url"
          onChange={onUrlChanged}
          placeholder="Enter URL of the video"
          size="md"
          type="url"
          value={url}
          autoComplete="off"
        />
        <If condition={errorMessage}>
          <Form.Control.Feedback type="invalid">
            {errorMessage}
          </Form.Control.Feedback>
        </If>
      </Form.Group>

      <Button
        disabled={disabled}
        type="submit"
        variant="primary"
      >
        Add to Queue
      </Button>
    </Form>
  </div>

InputForm.propTypes = {
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  onFormSubmit: PropTypes.func,
  onUrlChanged: PropTypes.func,
  url: PropTypes.string
};

/**
 * @function
 * @param {AppState} state -
 * @param {InputFormState} state.inputForm -
 * @returns {InputFormState} -
 */
const mapStateToProps = state => inputForm(state);

const mapDispatchToProps = {
  onUrlChanged: e => changeURL(e.target.value),
  onFormSubmit: e => {
    e.preventDefault();
    return submitTask(e.target.elements['url'].value);
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);
