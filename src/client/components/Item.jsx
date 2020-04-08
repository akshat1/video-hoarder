/**
 * Renders a single download-task, and displays metadata and status of the same.
 * Also provides controls to abort the download.
 */
import React from 'react';
import PropTypes from 'prop-types';
import ItemStatus from './ItemStatus';
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
      <div className={Style.title}>{title}</div>
      <div className={Style.url}>
        <div className={Style.label}>URL</div>
        <div className={Style.value} title={url}>{url}</div>
      </div>
      <div className={Style.status}>
        <ItemStatus status={status} />
      </div>
      <div className={Style.meta}>
        <div className={Style.label}>Added</div>
        <div className={Style.value}>{new Date(addedAt).toLocaleString()}</div>
        <div className={Style.label}>Updated</div>
        <div className={Style.value}>{new Date(updatedAt).toLocaleString()}</div>
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
