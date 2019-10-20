import './task.less';
import { connect } from 'react-redux';
import { selectedTaskId } from '../redux/selectors';
import { selectTask } from '../redux/actions';
import Badge from 'react-bootstrap/Badge';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const printableURL = url => decodeURI(url).replace(/^(http)s?:\/\/(www\.)?/, '');

const getTooltip = ({ status, url }) => `${status}, ${url}`;

const getContainerClassNames = isSelected =>
  classNames(
    'task', { 'task--selected': isSelected }
  );

const TaskStatusIcon = ({status}) =>
  <div className="task__status">
    <Choose>
      <When condition={status === 'pending'}>
        <Spinner animation="border" variant="secondary" />
      </When>
      <When condition={status === 'running'}>
        <Spinner animation="border" variant="success" />
      </When>
      <When condition={status === 'complete'}>
        <Badge pill variant="success">{'🗸'}</Badge>
      </When>
      <When condition={status === 'failed'}>
        <Badge pill variant="danger">{'☠️'}</Badge>
      </When>
      <Otherwise>
        <Badge pill variant="warning">{'?'}</Badge>
      </Otherwise>
    </Choose>
  </div>

TaskStatusIcon.propTypes = {
  status: PropTypes.string
};

const Task = ({ isSelected, task, selectTask }) =>
  <div className={getContainerClassNames(isSelected)}>
    <div className="task__row task__row--first">
      <TaskStatusIcon status={task.status} />
      <div className="task__url" title={getTooltip(task)}>
        <a href='#' onClick={selectTask}>
          {task.title || printableURL(task.url)}
        </a>
      </div>
    </div>
  </div>

Task.propTypes = {
  isSelected: PropTypes.bool,
  selectTask: PropTypes.func,
  task: PropTypes.object
};

const mapStateToProps = (state, { task }) => ({
  isSelected: task.id === selectedTaskId(state)
});

const mapDispatchToProps = (dispatch, { task }) => ({
  selectTask: () => dispatch(selectTask(task))
});

export default connect(mapStateToProps, mapDispatchToProps)(Task);
