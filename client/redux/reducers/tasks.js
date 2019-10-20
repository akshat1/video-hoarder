import { QueueUpdated } from '../actions';
import { tasks as DefaultState } from './default-state';

/**
 * @param {Object[]} state -
 * @returns {Object[]} -
 */
export default (state = DefaultState, { type, queue }) => type === QueueUpdated ? queue : state;
