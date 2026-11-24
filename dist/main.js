import { refreshItems } from "./data/items.js";
import { mountFilterChips } from "./components/filterChips.js";
import { mountSearchBar } from "./components/searchBar.js";
import { filterItems, renderItemGrid } from "./components/itemGrid.js";
import { openItemModal } from "./components/itemModal.js";
import { syncNavigation } from "./components/navigation.js";
import { mountLogout } from "./components/auth.js";
function requireElement(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Missing element #${id}`);
    return el;
}
function bootstrap() {
    syncNavigation();
    mountLogout();
    const grid = requireElement("item-grid");
    const counter = requireElement("item-count");
    const chips = requireElement("filter-chips");
    const search = requireElement("search-input");
    const typeFilter = requireElement("type-filter");
    const conditionFilter = requireElement("condition-filter");
    let currentCategory = "All";
    let currentQuery = "";
    let currentType = "All";
    let currentCondition = "All";
    function render() {
        const allItems = refreshItems();
        const filtered = filterItems(allItems, {
            category: currentCategory,
            query: currentQuery,
            listingType: currentType,
            condition: currentCondition,
        });
        renderItemGrid(grid, counter, filtered, (item) => {
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
