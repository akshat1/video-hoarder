import { Event } from "../../Event.js";
import { makeItem, markItemCanceled } from "../../model/Item.js";
import { Status } from "../../Status.js";
import { emit } from "../event-bus";
import { addJob, cancelJob, getJob, getJobsForUser,removeJob } from "./job-management";
import { find, findOne, getDb, getJobsCollection,insert, remove, update } from "./util.js";
import assert from "assert";
import sinon from "sinon";

jest.mock("./util");
jest.mock("../../model/Item.js");
jest.mock("../event-bus");

describe("db/job-management", () => {
  const db = { d: "b" };
  const jobsCollection = {  col: "lection" };

  beforeEach(() => {
    getDb.mockReset();
    getJobsCollection.mockReset();
    getDb.mockReturnValue(db);
    getJobsCollection.mockResolvedValue(jobsCollection);
    emit.mockReset();
  });

  test("addJob", async () => {
    const url = "bar";
    const job = { jo: "b" };
    const addedBy = "foo";
    makeItem.mockReturnValue(job);
    const expectedResult = { expected: "result" };
    insert.mockResolvedValue(expectedResult);
    const result = await addJob({ url, addedBy });
    expect(result).toBe(expectedResult);
    expect(insert).toHaveBeenCalledWith(jobsCollection, job, { w: 1 });
    expect(emit).toHaveBeenCalledWith(Event.ItemAdded, result);
  });

  test("cancelJob", async () => {
    const id = "some-item-id";
    const item = { id: id };
    update.mockResolvedValue([1]);
    findOne.mockResolvedValue(item);
    const expectedTime = "foo";
    const updatedBy = "bar";
    sinon.stub(Date.prototype, "toISOString").returns(expectedTime);
    const expectedItem = {
      ...item,
      status: Status.Failed,
      updatedAt: expectedTime,
      updatedBy,
    };
    markItemCanceled.mockReturnValue(expectedItem);
    const updatedItem = await cancelJob({ id, updatedBy });
    /*
    assert we updated item document with status canceled
      assert we called update with jobs collection, right query, and right update
    */
    assert.deepEqual(updatedItem, expectedItem);
    expect(update).toHaveBeenCalledWith(jobsCollection, { id: id }, expectedItem);
    expect(emit).toHaveBeenCalledWith(Event.ItemUpdated, expectedItem);
    sinon.restore();
  });

  test("removeJob", async () => {
    const id = "some-item-id";
    const item = { id: id };
    remove.mockResolvedValue(1);
    findOne.mockResolvedValue(item);
    const numRecordsRemoved = await removeJob(id);
    expect(remove).toHaveBeenCalledWith(jobsCollection, { id });
    expect(numRecordsRemoved).toBe(1);
    expect(emit).toHaveBeenCalledWith(Event.ItemRemoved, item);
  });

  test("getJob", async () => {
    const id = "baz";
    const expectedItem = { foo: "bar" };
    findOne.mockResolvedValue(expectedItem);
    const item = await getJob(id);
    expect(item).toBe(expectedItem);
    expect(findOne).toHaveBeenCalledWith(jobsCollection, { id });
  });

  test("getJobsForUser", async () => {
    const expectedItems = [ { a: "aye" }, { b: "bee "}];
    find.mockResolvedValue(expectedItems);
    const userName = "foo";
    const items = await getJobsForUser(userName);
    expect(items).toBe(expectedItems);
    expect(find).toHaveBeenCalledWith(jobsCollection, { addedBy: userName });
  });
});
