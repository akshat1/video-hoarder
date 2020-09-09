import { Event } from "../../Event";
import { makeItem, markItemCanceled } from "../../model/Item";
import { Status } from "../../Status";
import { emit } from "../event-bus";
import { addJob, cancelJob, getJob, getJobsForUser,removeJob } from "./job-management";
import { find, findOne, getDb, getJobsCollection,insert, remove, update } from "./util";
import assert from "assert";
import sinon from "sinon";

jest.mock("./util");
jest.mock("../../model/Item");
jest.mock("../event-bus");

describe("db/job-management", () => {
  const db = { d: "b" };
  const jobsCollection = {  col: "lection" };

  beforeEach(() => {
    // @ts-ignore
    getDb.mockReset();
    // @ts-ignore
    getJobsCollection.mockReset();
    // @ts-ignore
    getDb.mockReturnValue(db);
    // @ts-ignore
    getJobsCollection.mockResolvedValue(jobsCollection);
    // @ts-ignore
    emit.mockReset();
  });

  test("addJob", async () => {
    const url = "bar";
    const job = { jo: "b" };
    const createdBy = "foo";
    // @ts-ignore
    makeItem.mockReturnValue(job);
    const expectedResult = { expected: "result" };
    // @ts-ignore
    insert.mockResolvedValue([expectedResult]);
    const result = await addJob({ url, createdBy });
    expect(result).toBe(expectedResult);
    expect(insert).toHaveBeenCalledWith(jobsCollection, job, { w: 1 });
    expect(emit).toHaveBeenCalledWith(Event.ItemAdded, result);
  });

  test("cancelJob", async () => {
    const id = "some-item-id";
    const item = { id: id };
    // @ts-ignore
    update.mockResolvedValue({ count: 1, status: "foo" });
    // @ts-ignore
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
    // @ts-ignore
    markItemCanceled.mockReturnValue(expectedItem);
    const updatedItem = await cancelJob({ id, updatedBy });
    /*
    assert we updated item document with status canceled
      assert we called update with jobs collection, right query, and right update
    */
    assert.deepEqual(updatedItem, expectedItem);
    expect(update).toHaveBeenCalledWith(jobsCollection, { id: id }, expectedItem);
    expect(emit).toHaveBeenCalledWith(Event.ItemUpdated, {
      previous: item,
      item: expectedItem,
    });
    sinon.restore();
  });

  test("removeJob", async () => {
    const id = "some-item-id";
    const item = { id: id };
    // @ts-ignore
    remove.mockResolvedValue(1);
    // @ts-ignore
    findOne.mockResolvedValue(item);
    const numRecordsRemoved = await removeJob(id);
    expect(remove).toHaveBeenCalledWith(jobsCollection, { id });
    expect(numRecordsRemoved).toBe(1);
    expect(emit).toHaveBeenCalledWith(Event.ItemRemoved, item);
  });

  test("getJob", async () => {
    const id = "baz";
    const expectedItem = { foo: "bar" };
    // @ts-ignore
    findOne.mockResolvedValue(expectedItem);
    const item = await getJob(id);
    expect(item).toBe(expectedItem);
    expect(findOne).toHaveBeenCalledWith(jobsCollection, { id });
  });

  test("getJobsForUser", async () => {
    const expectedItems = [ { a: "aye" }, { b: "bee "}];
    // @ts-ignore
    find.mockResolvedValue(expectedItems);
    const userName = "foo";
    const items = await getJobsForUser(userName);
    expect(items).toBe(expectedItems);
    expect(find).toHaveBeenCalledWith(jobsCollection, { createdBy: userName });
  });
});
