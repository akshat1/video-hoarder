import { connect } from 'react-redux'
import { selectedTaskOutput } from '../redux/selectors';
import PropTypes from 'prop-types';
import React from 'react';

const TaskOutput = ({ output }) =>
  <div className="task-output">
    <pre>
      <For each="chunk" of={output}>
        {chunk}
      </For>
    </pre>
  </div>

TaskOutput.propTypes = {
  output: PropTypes.arrayOf(PropTypes.string)
};

const mapStateToProps = state => ({ output: selectedTaskOutput(state) });

export default connect(mapStateToProps)(TaskOutput);
