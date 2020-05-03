import React from 'react';
import PropTypes from 'prop-types';
import Style from './ItemMeta.less';
import { Status, hasStarted } from '../../Status';

const ItemMeta = ({ item }) => {
  const {
    addedAt,
    status,
    updatedAt,
  } = item;

  return (
    <table className={Style.wrapper}>
      <tbody>
        <tr>
          <td>Added</td>
          <td>{new Date(addedAt).toLocaleString()}</td>
        </tr>
        <If condition={hasStarted(status)}>
          <tr>
            <td>
              <Choose>
                <When condition={status === Status.Failed}>Failed</When>
                <When condition={status === Status.Running}>Updated</When>
                <When condition={status === Status.Succeeded}>Completed</When>
              </Choose>
            </td>
            <td>{new Date(updatedAt).toLocaleString()}</td>
          </tr>
        </If>
      </tbody>
    </table>
  );
};

ItemMeta.propTypes = {
  item: PropTypes.shape({
    addedAt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })
};

export default ItemMeta;
