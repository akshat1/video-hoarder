/**
 * Renders a single download-task, and displays metadata and status of the same.
 * Also provides controls to abort the download.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Style from './Item.less';

const Item = ({ item }) => {
  const {
    addedAt,
    status,
    title,
    updatedAt,
    url,
  } = item;
  return (
    <div className={Style.wrapper}>
      <h3 className={Style.title}>{title}</h3>
      <div className={Style.url}>
        <div className={Style.label}>URL</div>
        <div className={Style.value}>{url}</div>
      </div>
    </div>
  );
};

Item.propTypes = {
  item: PropTypes.shape({
    addedAt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })
};

export default Item;
