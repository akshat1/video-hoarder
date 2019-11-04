import Badge from 'react-bootstrap/Badge';
import PropTypes from 'prop-types';
import './task-status-icon.less';
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const TaskStatusIcon = ({status}) =>
  <div className="task-status-icon">
    <Choose>
      <When condition={status === 'pending'}>
        <Spinner animation="border" variant="secondary" />
      </When>
      <When condition={status === 'running'}>
        <Spinner animation="border" variant="success" />
      </When>
      <When condition={status === 'complete'}>
        <Badge pill variant="success">✔</Badge>
      </When>
      <When condition={status === 'failed'}>
        <Badge pill variant="danger">☠️</Badge>
      </When>
      <Otherwise>
        <Badge pill variant="warning">?</Badge>
      </Otherwise>
    </Choose>
  </div>

TaskStatusIcon.propTypes = {
  status: PropTypes.string
};

export default TaskStatusIcon;
