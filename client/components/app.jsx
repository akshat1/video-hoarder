import './app.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux';
import { selectedTaskId } from '../redux/selectors';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import InputForm from './input-form';
import PropTypes from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row';
import TaskDetails from './task-details';
import Tasks from './tasks';

const App = ({ selectedTaskId }) =>
  <Container fluid id="app">
    <Row noGutters>
      <Col sm={12} md={4} id="app__sidebar" className="order-sm-2 order-md-1">
        <Tasks />
      </Col>
      <Col sm={12} md={8} id="app__main" className="order-sm-1 order-md-2">
        <InputForm />
        <If condition={selectedTaskId}>
          <TaskDetails />
        </If>
      </Col>
    </Row>
  </Container>

App.propTypes = {
  selectedTaskId: PropTypes.string
};

const mapStateToProps = state => ({
  selectedTaskId: selectedTaskId(state)
});

export default connect(mapStateToProps)(App);
