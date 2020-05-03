/**
 * General, miscellaneous utility functions.
 * @module util
 */

/**
 * Given resolve and reject functions, returns another function that can be used as a callback to a TingoDB operation.
 * @func
 * @param {function} resolve 
 * @param {function} reject 
 */
export const inPromiseCallback = (resolve, reject) =>
  (err, ...data) => {
    if (err)
      reject(err);
    else
      resolve(data.length > 1 ? [...data] : data[0]);  // Because resolve takes a single arg, convert callback args into an array.
  };
