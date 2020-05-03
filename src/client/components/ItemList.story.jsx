import React from 'react';
import ItemList from './ItemList.jsx';
import { Status } from '../../Status';
import { getFakeItem} from '../fixtures/item';

const items = [
  getFakeItem(Status.Succeeded),
  getFakeItem(Status.Succeeded),
  getFakeItem(Status.Failed),
  getFakeItem(Status.Failed),
  getFakeItem(Status.Running),
  getFakeItem(Status.Running),
  getFakeItem(Status.Running),
  getFakeItem(Status.Running),
  getFakeItem(Status.Succeeded),
  getFakeItem(Status.Running),
  getFakeItem(Status.Succeeded),
  getFakeItem(Status.Running),
  getFakeItem(Status.Pending),
  getFakeItem(Status.Running),
  getFakeItem(Status.Pending),
  getFakeItem(Status.Pending),
  getFakeItem(Status.Pending),
];

export default {
  title: 'ItemList',
  component: ItemList,
};

export const Default = () =>
  <ItemList items={items} />
