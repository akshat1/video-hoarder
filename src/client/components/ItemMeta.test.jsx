import React from 'react';
import { shallow } from 'enzyme';
import { getFakeItem } from '../fixtures/item';
import Status from '../../Status';
import ItemMeta from './ItemMeta';

describe('components/ItemMeta', () => {
  Object.values(Status).forEach((status) => {
    test(`ItemMeta matches snapshot for ${status}`, () => {
      expect(shallow(<ItemMeta item={getFakeItem(status)} />)).toMatchSnapshot();
    });
  });
});
