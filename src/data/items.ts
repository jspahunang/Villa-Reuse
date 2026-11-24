import { getItems, DEFAULT_ITEMS } from "./systemStore.js";
import type { Item } from "../types.js";

export { DEFAULT_ITEMS };

export const ITEMS: Item[] = getItems();

export function refreshItems(): Item[] {
  return getItems().filter((item) => !item.hidden);
}
