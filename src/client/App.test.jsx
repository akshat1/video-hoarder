/** @jest-environment jsdom */
import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App.jsx';

describe('App', () => {
  test('App matches snapshot', () => {
    const component = shallow(<App />);
    expect(component).toMatchSnapshot();
  });
});
