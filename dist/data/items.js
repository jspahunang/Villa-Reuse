import { getItems, DEFAULT_ITEMS } from "./systemStore.js";
export { DEFAULT_ITEMS };
export const ITEMS = getItems();
export function refreshItems() {
    return getItems().filter((item) => !item.hidden);
}
