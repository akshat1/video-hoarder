/**
 * @typedef {function} Subscriber
 * @param {Object} [payload] -
 */

/**
 * @const {Map.<string, Set.<Subscriber[]>>}
 */
const subscribers = new Map();

/**
 * Add a subscriber for the given eventName.
 * @param {string} eventName -
 * @param {Subscriber} subscriber -
 */
export const subscribe = (eventName, subscriber) => {
  let subscribersForEventName = subscribers.get(eventName);
  if (!subscribersForEventName) {
    subscribersForEventName = new Set();
    subscribers.set(eventName, subscribersForEventName);
  }

  subscribersForEventName.add(subscriber);
};

/**
 * Remove a subscriber for the given eventName.
 * @param {string} eventName -
 * @param {Subscriber} subscriber -
 */
export const unsubscribe = (eventName, subscriber) => {
  const subscribersForEventName = subscribers.get(eventName);
  if (subscribersForEventName)
    subscribersForEventName.delete(subscriber);
};

/**
 * Calls all subscribers of the given eventName with the supplied optional payload.
 * @param {string} eventName -
 * @param {Object} [payload] -
 * @returns {Object[]} - An array containing values returned by each subscriber.
 */
export const emit = (eventName, payload) => {
  const subscribersForEventName = subscribers.get(eventName);
  if (subscribersForEventName)
    return Array.from(subscribersForEventName.values()).map(subscriber => subscriber(payload));

  return [];
};

/**
 * Execute the subcriber only once in response to this event.
 * @param {string} eventName -
 * @param {Subscriber} subscriber -
 */
export const once = (eventName, subscriber) => {
  const wrapper = (payload) => {
    subscriber(payload);
    unsubscribe(eventName, wrapper);
  };

  subscribe(eventName, wrapper);
}
