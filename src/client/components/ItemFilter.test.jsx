import { Status } from "../../Status";
import ItemFilter from "./ItemFilter.jsx";
import { shallow } from "enzyme";
import React from "react";

describe("components/ItemFilter", () => {
  test("should render and match snapshot", () => {
    Object.values(Status)
      .map(status =>
        expect(shallow(<ItemFilter onChange={() => 0} value={status}/>)).toMatchSnapshot()
      );
  });

  test("calls onChange", () => {
    const onChange = jest.fn();
    const wrapper = shallow(<ItemFilter onChange={onChange} value={Status.Failed}/>);
    const select = wrapper.find("select");
    select.simulate(
      "change",
      {
        currentTarget: { value: Status.Pending },
      },
    );
    expect(onChange).toHaveBeenCalledWith(Status.Pending);
  });
});
