import _ from 'lodash';
import './task-filter.less';
import { All } from '../../common/constants.mjs';
import { connect } from 'react-redux';
import { setStatusFilter } from '../redux/actions';
import { statusFilter, tasks } from '../redux/selectors';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import React from 'react';
import Status from '../../common/status.mjs';

const TaskFilter = (props) =>
  <ButtonToolbar className="task-filter" aria-label="Filter and clear tasks">
    <div>
      <ButtonGroup className="task-filter__filter">
        <Button variant="dark" active={props.isInProgress} onClick={props.setInProgress} disabled={!props.numInProgress}>
          {`In Progress (${props.numInProgress})`}
        </Button>
        <Button variant="dark" active={props.isCompleted} onClick={props.setCompleted} disabled={!props.numCompleted}>
          {`Completed (${props.numCompleted})`}
        </Button>
        <Button variant="dark" active={props.isFailed} onClick={props.setFailed} disabled={!props.numFailed}>
          {`Failed (${props.numFailed})`}
        </Button>
        <Button variant="dark" active={props.isPending} onClick={props.setPending} disabled={!props.numPending}>
          {`Pending (${props.numPending})`}
        </Button>
        <Button variant="dark" active={props.isAll} onClick={props.setAll} disabled={!props.numAll}>
          {`All (${props.numAll})`}
        </Button>
      </ButtonGroup>
    </div>
    <ButtonGroup className="task-filter__clear">
      <Button variant="light">🗑️ Clear</Button>
    </ButtonGroup>
  </ButtonToolbar>

const mapStateToProps = state => {
  const statusFilterValue = statusFilter(state);
  const allTasks = tasks(state);
  return {
    isAll: statusFilterValue === All,
    isCompleted: statusFilterValue === Status.complete,
    isFailed: statusFilterValue === Status.failed,
    isInProgress: statusFilterValue === Status.running,
    isPending: statusFilterValue === Status.pending,
    numAll: allTasks.length,
    numCompleted: _.filter(allTasks, { status: Status.complete }).length,
    numFailed: _.filter(allTasks, { status: Status.failed }).length,
    numInProgress: _.filter(allTasks, { status: Status.running }).length,
    numPending: _.filter(allTasks, { status: Status.pending }).length
  };
};

const mapDispatchToProps = dispatch => ({
  setAll: () => dispatch(setStatusFilter(All)),
  setCompleted: () => dispatch(setStatusFilter(Status.complete)),
  setFailed: () => dispatch(setStatusFilter(Status.failed)),
  setInProgress: () => dispatch(setStatusFilter(Status.running)),
  setPending: () => dispatch(setStatusFilter(Status.pending))
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskFilter);
