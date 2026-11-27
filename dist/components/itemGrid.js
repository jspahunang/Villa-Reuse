import { createItemCard } from "./itemCard.js";
function normalizeCategory(cat) {
    if (!cat)
        return "";
    const lower = cat.toLowerCase();
    if (lower === "clothes" || lower === "clothing")
        return "clothing";
    if (lower === "appliances" || lower === "electronics")
        return "electronics";
    return lower;
}
export function filterItems(items, { category, query, listingType, condition, }) {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
        if (item.hidden)
            return false;
        const matchesCategory = category === "All" ||
            item.category === category ||
            normalizeCategory(item.category) === normalizeCategory(category);
        const matchesQuery = q === "" ||
            item.title.toLowerCase().includes(q) ||
            (item.description && item.description.toLowerCase().includes(q)) ||
            item.category.toLowerCase().includes(q) ||
            (item.exchangeFor && item.exchangeFor.toLowerCase().includes(q));
        const matchesType = !listingType || listingType === "All" || item.listingType === listingType;
        const matchesCondition = !condition || condition === "All" || item.condition === condition;
        return matchesCategory && matchesQuery && matchesType && matchesCondition;
    });
}
export function sortItems(items, sortKey = "newest") {
    const list = [...items];
    switch (sortKey) {
        case "coins-low":
            return list.sort((a, b) => a.coins - b.coins);
        case "coins-high":
            return list.sort((a, b) => b.coins - a.coins);
        case "distance":
            return list.sort((a, b) => a.distanceKm - b.distanceKm);
        case "title-az":
            return list.sort((a, b) => a.title.localeCompare(b.title));
        case "newest":
        default:
            return list.sort((a, b) => {
                const idA = a.id.startsWith("item_") ? parseInt(a.id.replace("item_", ""), 10) : 0;
                const idB = b.id.startsWith("item_") ? parseInt(b.id.replace("item_", ""), 10) : 0;
                return idB - idA;
            });
    }
}
export function renderItemGrid(grid, counter, items, onViewItem) {
    grid.replaceChildren();
    if (items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "grid__empty-container";
        empty.innerHTML = `
      <p class="grid__empty">No items match your selected filters.</p>
      <small style="color:var(--c-muted); display:block; margin-top:6px;">Try clearing filters or search for another item.</small>
    `;
        grid.append(empty);
    }
    else {
        items.forEach((item) => {
            const card = createItemCard(item);
            const btn = card.querySelector('[data-action="view-item"]');
            if (btn && onViewItem) {
                btn.addEventListener("click", () => onViewItem(item));
            }
            grid.append(card);
        });
    }
    counter.textContent = `${items.length} ${items.length === 1 ? "item" : "items"}`;
}
