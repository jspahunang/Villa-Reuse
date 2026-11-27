import { refreshItems } from "./data/items.js";
import { mountFilterChips } from "./components/filterChips.js";
import { mountSearchBar } from "./components/searchBar.js";
import { filterItems, sortItems, renderItemGrid } from "./components/itemGrid.js";
import type { SortOption } from "./components/itemGrid.js";
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
  const sortSelect = document.getElementById("sort-select") as HTMLSelectElement | null;

  let currentCategory: CategoryFilter = "All";
  let currentQuery = "";
  let currentType: any = "All";
  let currentCondition: any = "All";
  let currentSort: SortOption = "newest";

  function render(): void {
    const allItems = refreshItems();
    const filtered = filterItems(allItems, {
      category: currentCategory,
      query: currentQuery,
      listingType: currentType,
      condition: currentCondition,
    });
    const sorted = sortItems(filtered, currentSort);

    renderItemGrid(grid, counter, sorted, (item: Item) => {
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

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      currentSort = (sortSelect.value as SortOption) || "newest";
      render();
    });
  }

  // Navigate hero donate button to post item
  document.getElementById("donate-btn")?.addEventListener("click", () => {
    window.location.href = "donate.html";
  });

  // Initial render
  setActiveChip("All");
  render();
}

bootstrap();
