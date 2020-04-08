import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import Item from './Item';
import Status from '../../Status';

const FakeItem = {
  addedAt: new Date(2020, 2, 29, 14, 30, 45).toISOString(),
  id: '3idh834dh348dhhfufh48',
  status: Status.Running,
  updatedAt: new Date(2020, 2, 29, 14, 32, 30).toString(),
  url: 'https://www.youtube.com/watch?v=eQ5Ru7Zu_1I?foo=bar&baz=qux',
  title: 'A collectible video'
};

export default {
  title: 'Item',
  component: Item,
  decorators: [withKnobs],
};

export const Default = () =>
  <Item item={FakeItem} />;
