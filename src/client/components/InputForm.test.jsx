import React from 'react';
import { shallow } from 'enzyme';
import InputForm from './InputForm';

describe('components/InputForm', () => {
  test('InputForm matches snapshot', () => {
    const component = shallow(<InputForm />);
    expect(component).toMatchSnapshot();
  });
});
