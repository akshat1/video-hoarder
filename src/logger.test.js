import sinon from 'sinon';
import assert from 'assert';
import { getLogger } from './logger.js';

describe('logger', () => {
  beforeAll(() => {
    sinon.stub(console, 'debug');
    sinon.stub(console, 'error');
    sinon.stub(console, 'info');
    sinon.stub(console, 'log');
    sinon.stub(console, 'warn');
  });

  afterAll(() => {
    sinon.restore();
  });

  const testLogMethods = (logger, expectedName) => {
    const stub = `[${expectedName}]`;
    logger.debug('a debug message');
    logger.error('an error message');
    logger.info('an info message');
    logger.log('a log message');
    logger.warn('a warn message');

    assert.ok(console.debug.calledWithExactly(stub, 'a debug message'));
    assert.ok(console.error.calledWithExactly(stub, 'an error message'));
    assert.ok(console.info.calledWithExactly(stub, 'an info message'));
    assert.ok(console.log.calledWithExactly(stub, 'a log message'));
    assert.ok(console.warn.calledWithExactly(stub, 'a warn message'));
  };

  test('getLogger without a parent', () => {
    const logger = getLogger('test-logger');
    assert.equal(logger.getName(), 'test-logger');
    testLogMethods(logger, 'test-logger');
  });

  test('getLogger with a parent', () => {
    const parentLogger = getLogger('parent')
    const logger = getLogger('child', parentLogger);
    assert.equal(logger.getName(), 'parent:child');
    testLogMethods(logger, 'parent:child');
  });
});
