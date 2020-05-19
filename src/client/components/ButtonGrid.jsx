import Style from "./ButtonGrid.less";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

const getButtonClassName = option => classNames({
  [Style.selected]: option.selected,
});

const getWrapperStyle = options => ({
  gridTemplateColumns: `repeat(${options.length}, 1fr)`,
});

const ButtonGrid = ({ options, onChange }) => (
  <div className={Style.wrapper} style={getWrapperStyle(options)}>
    <For each="option" of={options}>
      <button
        className={getButtonClassName(option)}
        disabled={option.disabled}
        onClick={() => onChange(option.value)}
        key={option.value}
      >
        {option.label}
      </button>
    </For>
  </div>
);

const ShapeOfOption = {
  className: PropTypes.string,
  disabled: PropTypes.boolean,
  label: PropTypes.string,
  selected: PropTypes.selected,
  value: PropTypes.any,
};

ButtonGrid.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape(ShapeOfOption)),
};

export default ButtonGrid;
