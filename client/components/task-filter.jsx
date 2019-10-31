import './task-filter.less';
import { connect } from 'react-redux';
import { setStatusFilter } from '../redux/actions';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import React from 'react';
import Status from '../../common/status.mjs';
import { All } from '../../common/constants.mjs';
import { statusFilter } from '../redux/selectors';

const TaskFilter = (props) =>
  <ButtonToolbar className="task-filter" aria-label="Filter and clear tasks">
    <div>
      <ButtonGroup className="task-filter__filter">
        <Button variant="dark" active={props.isInProgress} onClick={props.setInProgress}>In Progress</Button>
        <Button variant="dark" active={props.isCompleted} onClick={props.setCompleted}>Completed</Button>
        <Button variant="dark" active={props.isFailed} onClick={props.setFailed}>Failed</Button>
        <Button variant="dark" active={props.isPending} onClick={props.setPending}>Pending</Button>
        <Button variant="dark" active={props.isAll} onClick={props.setAll}>All</Button>
      </ButtonGroup>
    </div>
    <ButtonGroup className="task-filter__clear">
      <Button variant="light">🗑️ Clear</Button>
    </ButtonGroup>
  </ButtonToolbar>

const mapStateToProps = state => ({
  isAll: statusFilter(state) === All,
  isCompleted: statusFilter(state) === Status.complete,
  isFailed: statusFilter(state) === Status.failed,
  isInProgress: statusFilter(state) === Status.running,
  isPending: statusFilter(state) === Status.pending
});

const mapDispatchToProps = dispatch => ({
  setAll: () => dispatch(setStatusFilter(All)),
  setCompleted: () => dispatch(setStatusFilter(Status.complete)),
  setFailed: () => dispatch(setStatusFilter(Status.failed)),
  setInProgress: () => dispatch(setStatusFilter(Status.running)),
  setPending: () => dispatch(setStatusFilter(Status.pending))
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskFilter);
