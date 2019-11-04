import './app.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import InputForm from './input-form';
import React from 'react';
import Tasks from './tasks';
import TaskFilter from './task-filter';

const App = () =>
  <div id="app">
    <InputForm />
    <TaskFilter />
    <Tasks />
  </div>

App.propTypes = {};

export default App;
