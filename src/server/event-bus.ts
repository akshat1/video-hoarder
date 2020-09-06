/** @module server/event-bus */
import { Event } from "../Event";

type Subscriber = (payload?: any) => any;

const subscribers = new Map<Event, Set<Subscriber>>();

/**
 * Just for unit testing.
 * @private
 */
export const getSubscribersMap = (): Map<Event, Set<Subscriber>> => new Map(subscribers);

/**
 * Add a subscriber for the given eventName.
 */
export const subscribe = (eventName: Event, subscriber: Subscriber) => {
  let subscribersForEventName = subscribers.get(eventName);
  if (!subscribersForEventName) {
    subscribersForEventName = new Set<Subscriber>();
    subscribers.set(eventName, subscribersForEventName);
  }

  subscribersForEventName.add(subscriber);
};

/**
 * Remove a subscriber for the given eventName.
 */
export const unsubscribe = (eventName: Event, subscriber: Subscriber) => {
  const subscribersForEventName = subscribers.get(eventName);
  if (subscribersForEventName)
    subscribersForEventName.delete(subscriber);
};

/**
 * Calls all subscribers of the given eventName with the supplied optional payload.
 */
export const emit = (eventName: Event, payload: any): any[] => {
  const subscribersForEventName = subscribers.get(eventName);
  if (subscribersForEventName)
    return Array.from(subscribersForEventName).map(subscriber => subscriber(payload));

  return [];
};

/**
 * Execute the subcriber only once in response to this event.
 */
export const once = (eventName: Event, subscriber: Subscriber) => {
  const wrapper = (payload) => {
    subscriber(payload);
    unsubscribe(eventName, wrapper);
  };

  subscribe(eventName, wrapper);
};
