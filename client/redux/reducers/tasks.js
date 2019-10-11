import { tasks as DefaultState } from './default-state';
import { QueueUpdated } from '../actions';

/**
 * @param {Object[]} state -
 * @returns {Object[]} -
 */
export default (state = DefaultState, { type, queue }) => type === QueueUpdated ? queue : state;
