/** @module client/redux/boilerplate */

/**
 * An ActionCreator factory (yes it's a factory-factory. I'm one of those people now).
 * @function
 * @param {string} type
 * @returns {function}
 */
export var makeActionF = type => {
  /**
   * @function
   * @param {*} value 
   * @returns {Action}
   */
  var actionFactory = value => ({
    type,
    value
  });

  return actionFactory;
};
/**
 * A Reducer factory.
 * @function
 * @param {string} targetType
 * @param {*} defaultValue
 * @returns {function}
 */

export var makeReducer = (targetType, defaultValue) => {
  /**
   * @param {*} state - current value
   * @param {module:client/redux~Action} action -
   * @returns {*} state - new value
   */
  var reducer = function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultValue;
    var {
      type,
      value
    } = arguments.length > 1 ? arguments[1] : undefined;
    return type === targetType ? value : state;
  };

  return reducer;
};