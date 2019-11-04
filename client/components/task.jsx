import './task.less';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import React from 'react';
import TaskStatusIcon from './task-status-icon';
import TaskOutput from './task-output';


const printableURL = url => decodeURI(url).replace(/^(http)s?:\/\/(www\.)?/, '');

const getTooltip = ({ status, url }) => `${status}, ${url}`;

const Task = ({ task }) =>
  <Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey={task.id}>
        <div className="task__row task__row--first" title={getTooltip(task)}>
          <TaskStatusIcon status={task.status} />
          {task.title || printableURL(task.url)}
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

export default Task;
