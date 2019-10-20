import { combineReducers } from 'redux';
import { inputForm as DefaultState } from './default-state';
import * as Actions from '../actions';

const url = (state = DefaultState.url, { type, url }) => {
  if (type === Actions.ClearInputForm)
    return DefaultState.url;
  
  if (type === Actions.UrlChanged)
    return url;
  
  return state;
}

const disabled = (state = DefaultState.disabled, { type, disabled }) => {
  if (type === Actions.ClearInputForm)
    return DefaultState.disabled;
  
  if (type === Actions.SetInputFormDisabled)
    return disabled;
  
  return state;
}

const errorMessage = (state = DefaultState.errorMessage, { type, error }) => {
  if (type === Actions.ClearInputForm)
    return DefaultState.errorMessage;
  
  if (type === Actions.UrlChanged)
    return error ? `⛔ ${error.message}` : DefaultState.errorMessage;
  
  return state;
}

/**
 * @function inputState
 * @param {InputFormState} -
 * @param {Object} action -
 * @returns {InputFormState} -
 */
export default combineReducers({
  url,
  disabled,
  errorMessage
});
