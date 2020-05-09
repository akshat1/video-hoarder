import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import DeleteConfirmationDialog from './DeleteConfirmationDialog.jsx';

export default {
  title: 'DeleteConfirmationDialog',
  component: DeleteConfirmationDialog,
};

export const Default = () =>
  <DeleteConfirmationDialog
    jobTitle="Awesome video"
    onCancel={action("onCancel")}
    onConfirm={action("onConfirm")}
    open={boolean("Dialog open", true)}
  />;
