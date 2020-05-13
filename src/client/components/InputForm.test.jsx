import React from 'react';
import { shallow } from 'enzyme';
import { ThemeProvider } from '@material-ui/styles';
import { getTheme } from '../theme';
import InputForm from './InputForm.jsx';

describe('components/InputForm', () => {
  test('InputForm matches snapshot', () => {
    const instance = (
      <ThemeProvider theme={getTheme()}>
        <InputForm onSubmit={() => 0}/>
      </ThemeProvider>
    );
    const mounted = shallow(instance);
    expect(mounted).toMatchSnapshot();
  });
});
