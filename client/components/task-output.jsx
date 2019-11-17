import { connect } from 'react-redux'
import { taskOutput } from '../redux/selectors';
import PropTypes from 'prop-types';
import React from 'react';
import './task-output.less';

const TaskOutput = ({ output }) =>
  <div className="task-output">
    <pre>
      <For each="chunk" of={output}>
        {chunk}
      </For>
    </pre>
  </div>

TaskOutput.propTypes = {
  taskId: PropTypes.string,
  output: PropTypes.arrayOf(PropTypes.string)
};

const mapStateToProps = (state, { taskId }) => ({ output: (taskOutput(state)[taskId]||[]) });

export default connect(mapStateToProps)(TaskOutput);
