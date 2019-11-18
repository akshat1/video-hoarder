import './task.less';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import TaskStatusIcon from './task-status-icon';
import TaskOutput from './task-output';
import { abortTask } from '../redux/actions';
import Status from '../../common/status.mjs';


const printableURL = url => decodeURI(url).replace(/^(http)s?:\/\/(www\.)?/, '');
const getTooltip = ({ status, url }) => `${status}, ${url}`;

const Task = ({ task, abortTask, showStopButton }) =>
  <Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey={task.id} className="task__toggle">
        <div className="task__meta">
          <TaskStatusIcon status={task.status} />
          <div className="task__title" title={getTooltip(task)}>
            <label>{task.title || printableURL(task.url)}</label>
          </div>
          <If condition={showStopButton}>
            <Button title="Stop downloading" className="task__stop-button" variant="dark" onClick={abortTask}>
              🛑
              <label>Stop</label>
            </Button>
          </If>
        </div>
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey={task.id}>
      <div>
        <TaskOutput taskId={task.id} />
      </div>
    </Accordion.Collapse>
  </Card>

Task.propTypes = {
  task: PropTypes.object
};

const mapStateToProps = (state, ownProps) => ({
  showStopButton: ownProps.task.status === Status.pending || ownProps.task.status === Status.running
});

const mapDispatchToProps = (dispatch, { task }) => ({
  abortTask: (evt) => {
    evt.stopPropagation();
    dispatch(abortTask(task.id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Task);
