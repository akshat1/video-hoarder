import ButtonGrid from "./ButtonGrid.jsx";
import { shallow } from "enzyme";
import React from "react";

describe("components/ButtonGrid", () => {
  const options = [{
    className: "clFoo",
    disabled: true,
    label: "Foo",
    selected: true,
    value: "vFoo",
  }, {
    className: "clBar",
    label: "Bar",
    selected: true,
    value: "vBar",
  }, {
    className: "clBaz",
    label: "Baz",
    value: "vBaz",
  }, {
    className: "clQux",
    disabled: true,
    label: "Qux",
    value: "vQux",
  }];

  test("Renders and matches snapshot", () => {
    expect(shallow(<ButtonGrid options={options} onChange={() => 0} />)).toMatchSnapshot();
  });

  test("Calls onChange", () => {
    const onChange = jest.fn();
    const wrapper = shallow(<ButtonGrid options={options} onChange={onChange} />);
    const btnFoo = wrapper.findWhere(node => node.name() === "button" && node.text() === "Foo");
    const btnBaz = wrapper.findWhere(node => node.name() === "button" && node.text() === "Baz");
    btnFoo.simulate("click");
    expect(onChange).toHaveBeenCalledWith("vFoo");
    btnBaz.simulate("click");
    expect(onChange).toHaveBeenCalledWith("vBaz");
  });
});
