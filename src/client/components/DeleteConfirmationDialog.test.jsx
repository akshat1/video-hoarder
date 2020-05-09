import React from 'react';
import { shallow } from 'enzyme';
import { ThemeProvider } from '@material-ui/styles';
import { Theme } from '../theme';
import DeleteConfirmationDialog from './DeleteConfirmationDialog.jsx';

describe('components/DeleteConfirmationDialog', () => {
  test('DeleteConfirmationDialog matches snapshot', () => {
    const instance = 
      <ThemeProvider theme={Theme}>
        <DeleteConfirmationDialog
          jobTitle="Sample job"
          onCancel={() => 0}
          onConfirm={() => 0}
        />
      </ThemeProvider>;
    expect(shallow(instance)).toMatchSnapshot();
  });
});
