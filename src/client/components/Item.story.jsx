import { Status } from "../../model/Status";
import { getFakeItem } from "../fixtures/item";
import Item from "./Item";
import React from "react";

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
