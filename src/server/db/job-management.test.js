import { Collection, getDb, insert, getCollection } from './util.js';
import { addJob } from './job-management';
import { Status } from '../../Status.js';

jest.mock('./util');

describe('db/job-management', () => {
  test('addJob', async () => {
    const job = { jo: 'b' };
    const collection = {  col: 'lection' };
    const expectedResult = { expected: 'result' };
    const options = { op: 'tions' };
    const db = { d: 'b' };
    getDb.mockReturnValue(db);
    insert.mockResolvedValue(expectedResult);
    getCollection.mockResolvedValue(collection);
    const result = await addJob(job, options);
    expect(result).toBe(expectedResult);
    expect(getCollection).toHaveBeenCalledWith(db, Collection.Jobs);
    expect(insert).toHaveBeenCalledWith(collection, {
      ...job,
      status: Status.Pending,
    });
  });
});
