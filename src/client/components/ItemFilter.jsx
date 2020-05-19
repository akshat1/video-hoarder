/**
 * This component renders a drop-down on mobile, or a button group on desktop, letting the user
 * pick one of the item statuses.
 */
import { Status } from "../../Status";
import ButtonGrid from "./ButtonGrid.jsx";
import Style from "./ItemFilter.less";
import PropTypes from "prop-types";
import React from "react";

const ItemFilter = ({ value, onChange }) => {
  const options = Object.values(Status).sort().map(status => ({
    label: status,
    value: status,
    selected: status === value,
  }));

  return (
    <div className={Style.wrapper}>
      <div className={Style.mobile}>
        <select value={value} onChange={e => onChange(e.currentTarget.value)}>
          <For each="option" of={options}>
            <option
              value={option.value}
              key={option.value}
            >
              {option.label}
            </option>
          </For>
        </select>
      </div>
      <div className={Style.desktop}>
        <ButtonGrid
          onChange={onChange}
          options={options}
        />
      </div>
    </div>
  );
};

ItemFilter.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOf(Object.values(Status)),
};
export default ItemFilter;
