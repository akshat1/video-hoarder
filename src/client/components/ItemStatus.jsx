/**
 * Renders an icon appropriate to the given item status.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faDizzy, faHourglass, faCheck, faQuestion } from '@fortawesome/free-solid-svg-icons'
import Status from '../../Status';
import Style from './ItemStatus.less';

const ItemStatus = ({ status }) =>
  <div className={Style.wrapper}>
    <Choose>
      <When condition={status === Status.Failed}>
        <FontAwesomeIcon icon={faDizzy} />
      </When>
      <When condition={status === Status.Pending}>
        <FontAwesomeIcon icon={faHourglass} spin />
      </When>
      <When condition={status === Status.Running}>
        <FontAwesomeIcon icon={faSpinner} spin />
      </When>
      <When condition={status === Status.Succeeded}>
        <FontAwesomeIcon icon={faCheck} />
      </When>
      <Otherwise>
        <FontAwesomeIcon icon={faQuestion} />
      </Otherwise>
    </Choose>
  </div>;

ItemStatus.propTypes = {
  status: PropTypes.oneOf(Object.values(Status)),
};

export default ItemStatus;
