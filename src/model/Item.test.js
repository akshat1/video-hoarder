import { makeItem } from "./Item";
import { Status } from "./Status";
import assert from "assert";
import md5 from "blueimp-md5";
import sinon from "sinon";

describe("model/Item", () => {
  test("makeItem", () => {
    const now = new Date();
    sinon.useFakeTimers(now.getTime());
    const url = "https://footube/dkjkdfjdk";
    const createdBy = "le-user";
    const item = makeItem({ url, createdBy });
    assert.deepEqual(item, {
      createdAt: now.toISOString(),
      createdBy,
      id: md5(`${url}-${now.getTime()}`),
      metadata: null,
      status: Status.Pending,
      updatedAt: now.toISOString(),
      updatedBy: createdBy,
      url,
    });
  });
});
