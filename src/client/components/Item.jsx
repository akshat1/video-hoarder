/**
 * Renders a single download-task, and displays metadata and status of the same.
 * Also provides controls to abort the download.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ItemStatus from './ItemStatus';
import Style from './Item.less';
import Status from '../../Status';
import ItemMeta from './ItemMeta';

const getWrapperClass = status => classNames(Style.wrapper, {
  [Style.failed]: status === Status.Failed,
  [Style.pending]: status === Status.Pending,
  [Style.running]: status === Status.Running,
  [Style.succeeded]: status === Status.Succeeded,
});

const Item = ({ item }) => {
  const {
    status,
    title,
    url,
  } = item;

  return (
    <div className={getWrapperClass(status)}>
      <div className={Style.title}>{title}</div>
      <div className={Style.url}>
        <div className={Style.value} title={url}>
          <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        </div>
      </div>
      <div className={Style.status}>
        <ItemStatus status={status} />
      </div>
      <div className={Style.meta}>
        <ItemMeta item={item} />
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
