import React from 'react';
import PropTypes from 'prop-types';
import Item from './Item.jsx';
import Style from './ItemList.less';

const ItemList = ({ items }) => (
  <div className={Style.wrapper}>
    <For each="item" of={items}>
      <Item item={item} key={item.id}/>
    </For>
  </div>
);

ItemList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    addedAt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })),
};

ItemList.defaultProps = {
  items: [],
};

export default ItemList;
