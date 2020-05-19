import { Status } from "../../Status";
import { getFakeItem } from "../fixtures/item";
import ItemList from "./ItemList.jsx";
import { shallow } from "enzyme";
import React from "react";

describe("components/ItemList", () => {
  test("ItemList should match snapshot", () => {
    const items = [
      getFakeItem(Status.Succeeded),
      getFakeItem(Status.Succeeded),
      getFakeItem(Status.Failed),
      getFakeItem(Status.Failed),
      getFakeItem(Status.Running),
      getFakeItem(Status.Running),
      getFakeItem(Status.Running),
      getFakeItem(Status.Running),
      getFakeItem(Status.Succeeded),
      getFakeItem(Status.Running),
      getFakeItem(Status.Succeeded),
      getFakeItem(Status.Running),
      getFakeItem(Status.Pending),
      getFakeItem(Status.Running),
      getFakeItem(Status.Pending),
      getFakeItem(Status.Pending),
      getFakeItem(Status.Pending),
    ];

    expect(shallow(<ItemList items={items} />)).toMatchSnapshot()
  });
});
