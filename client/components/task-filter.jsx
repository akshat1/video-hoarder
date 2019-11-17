import _ from 'lodash';
import './task-filter.less';
import { All } from '../../common/constants.mjs';
import { connect } from 'react-redux';
import { clearQueue, setStatusFilter } from '../redux/actions';
import { statusFilter, tasks } from '../redux/selectors';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import React from 'react';
import Status from '../../common/status.mjs';

const FilterButtonLabel = ({ label, number }) =>
  <span>
    <label className="filter-button__label">{label}</label>
    <label className="filter-button__number">{`(${number})`}</label>
  </span>

const TaskFilter = (props) =>
  <ButtonToolbar className="task-filter" aria-label="Filter and clear tasks">
    <div>
      <ButtonGroup className="task-filter__filter">
        <Button variant="dark" active={props.isInProgress} onClick={props.setInProgress} size="sm" className="task-filter__button--running">
          <FilterButtonLabel label="In Progress" number={props.numInProgress}/>
        </Button>
        <Button variant="dark" active={props.isCompleted} onClick={props.setCompleted} size="sm" className="task-filter__button--complete">
          <FilterButtonLabel label="Completed" number={props.numCompleted}/>
        </Button>
        <Button variant="dark" active={props.isFailed} onClick={props.setFailed} size="sm" className="task-filter__button--failed">
          <FilterButtonLabel label="Failed" number={props.numFailed}/>
        </Button>
        <Button variant="dark" active={props.isPending} onClick={props.setPending} size="sm" className="task-filter__button--pending">
          <FilterButtonLabel label="Pending" number={props.numPending}/>
        </Button>
        <Button variant="dark" active={props.isAll} onClick={props.setAll} size="sm" className="task-filter__button--all">
          <FilterButtonLabel label="All" number={props.numAll}/>
        </Button>
      </ButtonGroup>
    </div>
    <Button variant="light" onClick={props.clearQueue} size="sm" className="task-filter__button--clear">
      <label>🗑️</label>
      <label className="filter-button__label">Clear</label>
    </Button>
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
  clearQueue,
  setAll: () => dispatch(setStatusFilter(All)),
  setCompleted: () => dispatch(setStatusFilter(Status.complete)),
  setFailed: () => dispatch(setStatusFilter(Status.failed)),
  setInProgress: () => dispatch(setStatusFilter(Status.running)),
  setPending: () => dispatch(setStatusFilter(Status.pending))
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskFilter);
