import { PubSub, PubSubEngine } from "graphql-subscriptions";

const pubSub = new PubSub();

export const getPubSub = (): PubSubEngine => pubSub;
