import React from 'react';
import { shallow } from 'enzyme';
import ItemStatus from './ItemStatus';
import Status from '../../Status';

describe('components/ItemTest', () => {
  Object.values(Status).forEach((status) => {
    test(`ItemTest matches snapshot for ${status}`, () =>
      expect(shallow(<ItemStatus status={status} />)).toMatchSnapshot()
    );
  });
});
