import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';
import InputForm from './InputForm.jsx';

export default {
  title: 'InputForm',
  component: InputForm,
  decorators: [withKnobs],
};

export const Default = () =>
  <InputForm
    onSubmit={action('submit')}
    initialValue={text('Initial value (initialValue)', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
  />;
