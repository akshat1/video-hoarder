import React from 'react';
import { shallow } from 'enzyme';
import InputForm from './InputForm.jsx';

describe('components/InputForm', () => {
  test('InputForm matches snapshot', () => {
    const component = shallow(<InputForm onSubmit={() => 0}/>);
    expect(component).toMatchSnapshot();
  });
});
