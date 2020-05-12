import sinon from 'sinon';
import assert from 'assert';
import md5 from 'blueimp-md5';
import { makeItem } from './Item';
import { Status } from '../Status';

describe('model/Item', () => {
  test('makeItem', () => {
    const now = new Date();
    sinon.useFakeTimers(now.getTime());
    const url = 'https://footube/dkjkdfjdk';
    const addedBy = 'le-influencer';
    const item = makeItem({ url, addedBy });
    assert.deepEqual(item, {
      addedAt: now.toISOString(),
      addedBy,
      description: null,
      id: md5(`${url}-${now.getTime()}`),
      thumbnail: null,
      title: null,
      status: Status.Pending,
      updatedAt: now.toISOString(),
      url,
    });
  });
});
