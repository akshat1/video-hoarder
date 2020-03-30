/** @module client/redux/boilerplate */

/**
 * An ActionCreator factory (yes it's a factory-factory. I'm one of those people now).
 * @function
 * @param {string} type
 * @returns {function}
 */
export const makeActionF = (type) => {
  /**
   * @function
   * @param {*} value 
   * @returns {Action}
   */
  const actionFactory = value => ({type, value });
  return actionFactory;
}

/**
 * A Reducer factory.
 * @function
 * @param {string} targetType
 * @param {*} defaultValue
 * @returns {function}
 */
export const makeReducer = (targetType, defaultValue) => {
  /**
   * @param {*} state - current value
   * @param {module:client/redux~Action} action -
   * @returns {*} state - new value
   */
  const reducer = (state = defaultValue, { type, value }) => type === targetType ? value : state;
  return reducer;
}
