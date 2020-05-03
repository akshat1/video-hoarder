import React from 'react';
import { shallow } from 'enzyme';
import Item from './Item.jsx';
import { Status } from '../../Status';
import { getFakeItem } from '../fixtures/item';

describe('components/Item', () => {
  Object.values(Status).forEach((status) =>
    test(`Item matches snapshot for ${status}`, () =>
      expect(shallow(<Item item={getFakeItem(status)} />)).toMatchSnapshot()
    )
  );
});
