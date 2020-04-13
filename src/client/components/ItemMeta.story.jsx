import React from 'react';
import ItemMeta from './ItemMeta';
import Status from '../../Status';
import { getFakeItem } from '../fixtures/item';

export default {
  title: 'ItemMeta',
  component: ItemMeta,
};

export const Pending = () =>
  <ItemMeta item={getFakeItem(Status.Pending)} />;

export const Running = () =>
  <ItemMeta item={getFakeItem(Status.Running)} />;

export const Failed = () =>
  <ItemMeta item={getFakeItem(Status.Failed)} />;

export const Succeeded = () =>
  <ItemMeta item={getFakeItem(Status.Succeeded)} />;
