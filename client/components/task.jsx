import './task.less';
import Badge from 'react-bootstrap/Badge';
import classNames from 'classnames';
import { connect } from 'react-redux';
import ProgressBar from 'react-bootstrap/ProgressBar';
import React from 'react';
import { selectTask } from '../redux/actions';
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

const Task = ({ task, selectTask, isSelected }) =>
  <div className={getContainerClassNames(isSelected)}>
    <div className="task__row task__row--first">
      <TaskStatusIcon status={task.status} />
      <div className="task__url" title={getTooltip(task)}>
        <a href='#' onClick={selectTask}>
          {task.title || printableURL(task.url)}
        </a>
      </div>
    </div>
    <div className="task__row task__row--second">
      <ProgressBar now={task.stats.downloadPercent} label={`${task.stats.downloadPercent}%`}/>
    </div>
  </div>

const mapStateToProps = ({ selectedTaskId }, { task }) => ({
  isSelected: task.id === selectedTaskId
});

const mapDispatchToProps = (dispatch, { task }) => ({
  selectTask: () => dispatch(selectTask(task))
});

export default connect(mapStateToProps, mapDispatchToProps)(Task);
