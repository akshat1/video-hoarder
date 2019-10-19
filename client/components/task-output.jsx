import { connect } from 'react-redux'
import React from 'react';
import { selectedTaskOutput } from '../redux/selectors';

const TaskOutput = ({ output }) =>
  <div className="task-output">
    <pre>
      <For each="chunk" of={output}>
        {chunk}
      </For>
    </pre>
  </div>

const mapStateToProps = state => ({ output: selectedTaskOutput(state) });

export default connect(mapStateToProps)(TaskOutput);
