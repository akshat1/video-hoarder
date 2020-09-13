import { hasConcluded, hasStarted, Status} from "./Status";
import assert from "assert";

describe("Status", () => {
  test("hasStarted", () => {
    assert.equal(hasStarted("foo"), false);
    assert.equal(hasStarted(Status.Pending), false);
    assert.equal(hasStarted(Status.Running), true);
    assert.equal(hasStarted(Status.Failed), true);
    assert.equal(hasStarted(Status.Succeeded), true);
  });

  test("hasConcluded", () => {
    assert.equal(hasConcluded("foo"), false);
    assert.equal(hasConcluded(Status.Pending), false);
    assert.equal(hasConcluded(Status.Running), false);
    assert.equal(hasConcluded(Status.Failed), true);
    assert.equal(hasConcluded(Status.Succeeded), true);
  });
});