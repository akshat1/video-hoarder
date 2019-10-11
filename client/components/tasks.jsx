import './tasks.less';
import _ from 'lodash';
import { connect } from 'react-redux';
import React from 'react';
import Task from './task';

const Tasks = ({ tasks }) =>
  <div className="tasks">
    <h3 className="tasks__label">Queue</h3>
    <ul className="tasks__list">
      <For each="task" of={tasks}>
        <li className="tasks__list-item"><Task task={task} key={task.id} /></li>
      </For>
    </ul>
  </div>

const mapStateToProps = ({ tasks }) =>({
  tasks: _.sortBy(tasks, 'added')
});

export default connect(mapStateToProps)(Tasks);
