import './input-form.less';
import { changeURL, submitTask } from '../redux/actions';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import React from'react';

const InputForm = ({ url, onFormSubmit, disabled, onUrlChanged, errorMessage }) =>
  <div className="input-form">
    <Form onSubmit={onFormSubmit}>
      <Form.Group>
        <Form.Label>Queue up a download</Form.Label>
        <Form.Control
          disabled={disabled}
          name="url"
          onChange={onUrlChanged}
          placeholder="Enter URL of the video"
          size="md"
          type="url"
          value={url}
          autocomplete="off"
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

/**
 * @function
 * @param {AppState} state -
 * @param {InputFormState} state.inputForm -
 * @returns {InputFormState} -
 */
const mapStateToProps = ({ inputForm }) => inputForm;

const mapDispatchToProps = {
  onUrlChanged: e => changeURL(e.target.value),
  onFormSubmit: e => {
    e.preventDefault();
    return submitTask(e.target.elements['url'].value);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);
