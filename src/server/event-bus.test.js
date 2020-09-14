import { emit, getSubscribersMap,once, subscribe, unsubscribe } from "./event-bus";
import assert from "assert";
import sinon from "sinon";

describe("event-bus", () => {
  test("subscribe", () => {
    /* Tests that
    1. a new set is created for a brand new event name.
    2. a subscriber is added for to the set of event brand name.
    3. another subscriber is added to an existing set for an existing event name.
    4. subscribers are stored in the order in which the order we subscribed. */
    const eventName = "test-event-subscribe";
    const subscriberA = function subscriberA() {};
    const subscriberB = function subscriberB() {};
    subscribe(eventName, subscriberA);
    subscribe(eventName, subscriberB);
    assert.deepEqual(Array.from(getSubscribersMap().get(eventName)), [subscriberA, subscriberB]);
  });

  test("unsubscribe", () => {
    /* Tests that
    1. removes subscriber from the indicated event.
    2. does not remove a subscriber from another event if subscribed to multiple events.
    3. does not throw any errors if a non-existant subscriber/event is removed. */
    const eventA = "test-event-A-unsubscribe";
    const eventB = "test-event-B-unsubscribe";
    const subscriberOne = function subscriberOne() {};
    const subscriberTwo = function subscriberTwo() {};
    // Should not throw errors when unsubscribing non-existant subscriptions.
    unsubscribe(eventA, subscriberOne);
    unsubscribe("foo", subscriberOne);

    // Setup for the rest of the assertions
    subscribe(eventA, subscriberOne);
    subscribe(eventA, subscriberTwo);
    subscribe(eventB, subscriberOne);

    unsubscribe(eventA, subscriberOne);
    assert.equal(getSubscribersMap().get(eventA).has(subscriberOne), false);  // should remove eventA+subscriberOne.
    assert.equal(getSubscribersMap().get(eventA).has(subscriberTwo), true);  // should not remove other subscribers for eventA.
    assert.equal(getSubscribersMap().get(eventB).has(subscriberOne), true);  // should not remove subscription function from other events.

    unsubscribe(eventA, subscriberOne);  // should not throw error if same unsubscription is repeated.
  });

  test("emit", () => {
    const eventA = "test-event-A-emit";
    const eventB = "test-event-B-emit";

    const subscriberOne = sinon.stub().returns("one");
    const subscriberTwo = sinon.stub().returns("two");
    const subscriberThree = sinon.stub().returns("three");

    subscribe(eventA, subscriberOne);
    subscribe(eventA, subscriberTwo);
    subscribe(eventB, subscriberTwo);
    subscribe(eventB, subscriberThree);

    const payloadA = { payload: "a" };
    const payloadB = { payload: "a" };
    const resultA = emit(eventA, payloadA);
    const resultB = emit(eventB, payloadB);

    assert.deepEqual(subscriberOne.args, [[payloadA]]);
    assert.deepEqual(subscriberTwo.args, [[payloadA], [payloadB]]);
    assert.deepEqual(subscriberThree.args, [[payloadB]]);
    console.log(getSubscribersMap().get(eventA));
    assert.deepEqual(resultA, ["one", "two"]);
    assert.deepEqual(resultB, ["two", "three"]);

    assert.deepEqual(emit("unknown-event"), []);
  });

  test("once", () => {
    const eventName = "test-event-once";
    const subscriber = sinon.stub();
    const payload = { pay: "load" };
    once(eventName, subscriber);
    emit(eventName, payload);
    emit(eventName, payload);
    emit(eventName, "foo");
    emit(eventName, { ba: "are" });
    emit(eventName, payload);
    assert.deepEqual(subscriber.args, [[payload]]);  // should have been called exactly once, with the right payload.
  });
});
