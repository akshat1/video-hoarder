import './input-form.less';
import { changeURL, submitTask } from '../redux/actions';
import { connect } from 'react-redux';
import React from'react';

const InputForm = ({ url, onFormSubmit, disabled, onUrlChanged, errorMessage }) =>
  <form className="input-form" onSubmit={onFormSubmit}>
    <h3>Add a new task</h3>
    <label>
      URL
      <input className="input-form__url" name="url" value={url} disabled={disabled} onChange={onUrlChanged}/>
      <div className="input-form__error">{errorMessage}</div>
    </label>
    <button className="input-form__submit" type="submit" disabled={disabled}>Add</button>
  </form>

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
