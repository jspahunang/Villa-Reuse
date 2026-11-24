import { refreshItems } from "./data/items.js";
import { mountFilterChips } from "./components/filterChips.js";
import { mountSearchBar } from "./components/searchBar.js";
import { filterItems, renderItemGrid } from "./components/itemGrid.js";
import { openItemModal } from "./components/itemModal.js";
import { syncNavigation } from "./components/navigation.js";
import { mountLogout } from "./components/auth.js";
import type { CategoryFilter, Item } from "./types.js";

function requireElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

function bootstrap(): void {
  syncNavigation();
  mountLogout();
  const grid = requireElement<HTMLElement>("item-grid");
  const counter = requireElement<HTMLElement>("item-count");
  const chips = requireElement<HTMLElement>("filter-chips");
  const search = requireElement<HTMLInputElement>("search-input");
  const typeFilter = requireElement<HTMLSelectElement>("type-filter");
  const conditionFilter = requireElement<HTMLSelectElement>("condition-filter");

  let currentCategory: CategoryFilter = "All";
  let currentQuery = "";
  let currentType: any = "All";
  let currentCondition: any = "All";

  function render(): void {
    const allItems = refreshItems();
    const filtered = filterItems(allItems, {
      category: currentCategory,
      query: currentQuery,
      listingType: currentType,
      condition: currentCondition,
    });

    renderItemGrid(grid, counter, filtered, (item: Item) => {
      openItemModal(item, () => {
        render();
      });
    });
  }

  const setActiveChip = mountFilterChips(chips, (cat) => {
    currentCategory = cat;
    setActiveChip(cat);
    render();
  });

  mountSearchBar(search, (q) => {
    currentQuery = q;
    render();
  });

  typeFilter.addEventListener("change", () => {
    currentType = typeFilter.value;
    render();
  });

  conditionFilter.addEventListener("change", () => {
    currentCondition = conditionFilter.value;
    render();
  });

  // Navigate hero donate button to post item
  document.getElementById("donate-btn")?.addEventListener("click", () => {
    window.location.href = "donate.html";
  });

  // Initial render
  setActiveChip("All");
  render();
}

bootstrap();
