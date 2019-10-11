import './task.less';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React from 'react';
import { selectTask } from '../redux/actions';

const printableURL = url => decodeURI(url).replace(/^(http)s?:\/\/(www\.)?/, '');

const getTooltip = ({ status, url }) => `${status}, ${url}`;

const getContainerClassNames = ({ isSelected, task }) =>
  classNames(
    'task', `task--${task.status}`, { 'task--selected': isSelected }
  );

const Task = ({ task, selectTask, isSelected }) =>
  <div className={getContainerClassNames({ isSelected, task })}>
    <div className="task__url" title={getTooltip(task)}>
      <a href='#' onClick={selectTask}>
        {task.title || printableURL(task.url)}
      </a>
    </div>
  </div>

const mapStateToProps = ({ selectedTaskId }, { task }) => ({
  isSelected: task.id === selectedTaskId
});

const mapDispatchToProps = (dispatch, { task }) => ({
  selectTask: () => dispatch(selectTask(task))
});

export default connect(mapStateToProps, mapDispatchToProps)(Task);
