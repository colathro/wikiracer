import { ItemType } from "../enums/ItemType";

export type StoreItem = {
  name: string;
  price: number;
  type: ItemType;
};
