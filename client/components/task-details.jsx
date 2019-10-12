import './task-details.less';
import { connect } from 'react-redux';
import React from 'react';
import TaskOutput from './task-output';

const TaskDetails = ({ task }) =>
  <If condition={task}>
    <div className="task-details">
      <div className="task-details__table">
        <h3>Task details:</h3>
        <table>
          <tr>
            <td>URL</td>
            <td><a href={task.url}>{task.url}</a></td>
          </tr>
          <tr>
            <td>Status</td>
            <td className="task-details__status">{task.status}</td>
          </tr>
          <tr>
            <td>Added</td>
            <td>{new Date(task.added).toLocaleTimeString()}</td>
          </tr>
          <If condition={task.finished}>
            <tr>
              <td>Finished</td>
              <td>{new Date(task.finished).toLocaleTimeString()}</td>
            </tr>
          </If>
        </table>
      </div>
      <div className="task-details__output">
        <TaskOutput />
      </div>
    </div>
  </If>

const mapStateToProps = ({ selectedTaskId, tasks }) => ({
  task: tasks.find(item => item.id === selectedTaskId)
});

export default connect(mapStateToProps)(TaskDetails);
