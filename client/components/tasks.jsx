import _ from 'lodash';
import './tasks.less';
import { connect } from 'react-redux';
import { filteredTasks } from '../redux/selectors';
import Accordion from 'react-bootstrap/Accordion';
import PropTypes from 'prop-types';
import React from 'react';
import Task from './task';

const Tasks = ({ tasks }) =>
  <div className="tasks">
    <Accordion>
      <For each="task" of={tasks}>
        <Task task={task} key={task.id} />
      </For>
    </Accordion>
  </div>

Tasks.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.Object)
};

const mapStateToProps = (state) =>({
  tasks: _.sortBy(filteredTasks(state), 'added')
});

export default connect(mapStateToProps)(Tasks);
