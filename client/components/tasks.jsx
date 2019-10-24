import _ from 'lodash';
import './tasks.less';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import Task from './task';

const Tasks = ({ tasks }) =>
  <div className="tasks">
    <label className="tasks__label">Queue</label>
    <ul className="tasks__list">
      <For each="task" of={tasks}>
        <li className="tasks__list-item" key={task.id}>
          <Task task={task} />
        </li>
      </For>
    </ul>
  </div>

Tasks.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.Object)
};

const mapStateToProps = ({ tasks }) =>({
  tasks: _.sortBy(tasks, 'added')
});

export default connect(mapStateToProps)(Tasks);
