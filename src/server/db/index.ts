/**
 * The database module. Because I don't want to spin up a whole database server (but I do want the benefits of a
 * database), I'm using [TingoDB](https://github.com/sergeyksv/tingodb) which is _"an embedded JavaScript in-process
 * filesystem or in-memory database upwards compatible with MongoDB"_. Unfortunately TingoDB is only compatible with
 * Mongo v1.4, is quite old, and never learnt about Promises. So you will see many wrappers in this module.
 *
 * @module server/db
 */

export { initialize } from "./initialize";
export * from "./util";
export * from "./job-management";
export * from "./user-management";
