import React from "react";
import Item from "./Item.jsx";
import { Status } from "../../Status";
import { getFakeItem } from "../fixtures/item";

export default {
  title: "Item",
  component: Item,
};

export const Pending = () =>
  <Item item={getFakeItem(Status.Pending)} />;

export const Running = () =>
  <Item item={getFakeItem(Status.Running)} />;

export const Failed = () =>
  <Item item={getFakeItem(Status.Failed)} />;

export const Succeeded = () =>
  <Item item={getFakeItem(Status.Succeeded)} />;
