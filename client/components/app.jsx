import './app.less';
import _ from 'lodash';
import { connect } from 'react-redux';
import InputForm from './input-form';
import React from 'react';
import TaskDetails from './task-details';
import Tasks from './tasks';

const App = ({ selectedTaskId }) =>
  <div id="app">
    <div id="app__mid">
      <div id="app__left"><Tasks /></div>
      <div id="app__right">
        <InputForm />
        <If condition={selectedTaskId}>
          <hr />
          <TaskDetails />
        </If>
      </div>
    </div>
  </div>

const mapStateToProps = state => _.pick(state, ['selectedTaskId'])

export default connect(mapStateToProps)(App);
