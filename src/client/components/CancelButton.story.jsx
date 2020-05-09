import React from 'react';
import { action } from '@storybook/addon-actions';
import { CancelButton } from './CancelButton.jsx';
import { Status } from '../../Status';
import { getFakeItem } from '../fixtures/item';

export default {
  title: 'CancelButton',
  component: CancelButton,
};

export const Pending = () =>
  <CancelButton item={getFakeItem(Status.Pending)} doCancel={action('Cancel download')}/>;

export const Running = () =>
  <CancelButton item={getFakeItem(Status.Running)} doCancel={action('Cancel download')}/>;

export const Failed = () =>
  <CancelButton item={getFakeItem(Status.Failed)} doCancel={action('Cancel download')}/>;

export const Succeeded = () =>
  <CancelButton item={getFakeItem(Status.Succeeded)} doCancel={action('Cancel download')}/>;