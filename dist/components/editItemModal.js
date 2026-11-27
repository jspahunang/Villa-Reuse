import { updateItem, deleteItem } from "../data/systemStore.js";
import { getActiveUser, addUserNotification } from "../data/profileData.js";
function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}
const SAMPLE_PHOTOS = [
    { label: "Clothing / Denim", url: "assets/denim-jacket.png" },
    { label: "Electronics / Kettle", url: "assets/electric-kettle.png" },
    { label: "Books / Handbook", url: "assets/design-handbook.png" },
    { label: "Kitchen / Dinnerware", url: "assets/ceramic-table-set.png" },
];
const CATEGORIES = [
    "Clothing",
    "School Supplies",
    "Household Items",
    "Furniture",
    "Electronics",
    "Kitchen Items",
    "Books",
    "Others",
];
let activeOverlay = null;
let escHandler = null;
export function closeEditItemModal() {
    if (activeOverlay) {
        activeOverlay.classList.remove("modal-overlay--open");
        activeOverlay.style.display = "none";
    }
    if (escHandler) {
        document.removeEventListener("keydown", escHandler);
        escHandler = null;
    }
}
export function openEditItemModal(item, onSaved, onDeleted) {
    const activeUser = getActiveUser();
    let overlay = document.getElementById("edit-item-modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "edit-item-modal-overlay";
        overlay.className = "modal-overlay";
        overlay.style.zIndex = "280";
        document.body.append(overlay);
    }
    else {
        overlay.style.zIndex = "280";
    }
    activeOverlay = overlay;
    if (escHandler)
        document.removeEventListener("keydown", escHandler);
    escHandler = (e) => {
        if (e.key === "Escape")
            closeEditItemModal();
    };
    document.addEventListener("keydown", escHandler);
    overlay.onclick = (e) => {
        if (e.target === overlay)
            closeEditItemModal();
    };
    let chosenImage = item.image;
    let currentType = item.listingType;
    overlay.innerHTML = `
    <div class="modal-dialog activity-dialog" style="max-width: 580px; max-height: 90vh; overflow-y: auto;" role="dialog" aria-modal="true" aria-labelledby="edit-item-title">
      <button class="modal-close" type="button" aria-label="Close dialog">&times;</button>
      
      <div class="act-body" style="padding: 24px;">
        <div class="act-header" style="margin-bottom: 18px;">
          <div class="act-header__left">
            <span class="act-badge act-badge--green">Listing Editor</span>
            <h2 class="act-title" id="edit-item-title" style="font-size: 22px; margin: 4px 0 2px;">Edit Item Listing</h2>
            <p class="act-subtitle" style="font-size: 13px; margin: 0;">Update details, category, photo, or status for <strong>${escapeHtml(item.title)}</strong>.</p>
          </div>
        </div>

        <form id="edit-item-form" style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Item Title -->
          <div class="field">
            <label class="field__label" for="edit-title" style="font-weight: 700; font-size: 12px; display: block; margin-bottom: 4px;">Item Title <span style="color:#b23b2e;">*</span></label>
            <input class="field__input" id="edit-title" type="text" required value="${escapeHtml(item.title)}" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 13px;" />
          </div>

          <!-- Category and Condition Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="field">
              <label class="field__label" for="edit-category" style="font-weight: 700; font-size: 12px; display: block; margin-bottom: 4px;">Category <span style="color:#b23b2e;">*</span></label>
              <select class="field__input" id="edit-category" style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 13px;">
                ${CATEGORIES.map((c) => `<option value="${c}" ${c === item.category || (c === "Clothing" && item.category === "Clothes") || (c === "Electronics" && item.category === "Appliances") ? "selected" : ""}>${c}</option>`).join("")}
              </select>
            </div>

            <div class="field">
              <label class="field__label" for="edit-condition" style="font-weight: 700; font-size: 12px; display: block; margin-bottom: 4px;">Condition <span style="color:#b23b2e;">*</span></label>
              <select class="field__input" id="edit-condition" style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 13px;">
                <option value="Like New" ${item.condition === "Like New" ? "selected" : ""}>Like New</option>
                <option value="Good" ${item.condition === "Good" ? "selected" : ""}>Good</option>
                <option value="Fair" ${item.condition === "Fair" ? "selected" : ""}>Fair</option>
              </select>
            </div>
          </div>

          <!-- Listing Type and Availability Status Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="field">
              <label class="field__label" for="edit-listing-type" style="font-weight: 700; font-size: 12px; display: block; margin-bottom: 4px;">Listing Type <span style="color:#b23b2e;">*</span></label>
              <select class="field__input" id="edit-listing-type" style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 13px;">
                <option value="Donation" ${item.listingType === "Donation" ? "selected" : ""}>Free Donation</option>
                <option value="Exchange" ${item.listingType === "Exchange" ? "selected" : ""}>Item Exchange / Swap</option>
              </select>
            </div>

            <div class="field">
              <label class="field__label" for="edit-status" style="font-weight: 700; font-size: 12px; display: block; margin-bottom: 4px;">Availability Status <span style="color:#b23b2e;">*</span></label>
              <select class="field__input" id="edit-status" style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 13px;">
                <option value="Available" ${item.status === "Available" ? "selected" : ""}>Available</option>
                <option value="Requested" ${item.status === "Requested" ? "selected" : ""}>Requested</option>
                <option value="Reserved" ${item.status === "Reserved" ? "selected" : ""}>Reserved</option>
                <option value="Completed" ${item.status === "Completed" ? "selected" : ""}>Completed</option>
                <option value="Donated" ${item.status === "Donated" ? "selected" : ""}>Donated</option>
                <option value="Exchanged" ${item.status === "Exchanged" ? "selected" : ""}>Exchanged</option>
              </select>
            </div>
          </div>

          <!-- Exchange Wishlist (conditional) -->
          <div class="field" id="edit-exchange-wish-group" style="${item.listingType === "Exchange" ? "display:block;" : "display:none;"}">
            <label class="field__label" for="edit-exchange-wish" style="font-weight: 700; font-size: 12px; display: block; margin-bottom: 4px;">Exchange Wishlist</label>
            <input class="field__input" id="edit-exchange-wish" type="text" value="${escapeHtml(item.exchangeFor || "")}" placeholder="e.g. Desk fan, blender, or books" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 13px;" />
          </div>

          <!-- Coin Value -->
          <div class="field">
            <label class="field__label" for="edit-coins" style="font-weight: 700; font-size: 12px; display: block; margin-bottom: 4px;">ReUse Coins Reward</label>
            <input class="field__input" id="edit-coins" type="number" min="5" max="200" value="${item.coins}" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 13px;" />
          </div>

          <!-- Description -->
          <div class="field">
            <label class="field__label" for="edit-description" style="font-weight: 700; font-size: 12px; display: block; margin-bottom: 4px;">Description & Details</label>
            <textarea class="field__input" id="edit-description" rows="3" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 13px; font-family: inherit;">${escapeHtml(item.description || item.details || "")}</textarea>
          </div>

          <!-- Photo Section -->
          <div style="background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--radius-md); padding: 14px;">
            <label style="font-size: 12px; font-weight: 700; color: var(--c-text); display: block; margin-bottom: 8px;">Listing Picture</label>
            
            <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 12px;">
              <div style="width: 80px; height: 60px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--c-border); background: #fff; flex-shrink: 0;">
                <img id="edit-item-preview-img" src="${escapeHtml(chosenImage)}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
              </div>
              <div style="flex-grow: 1;">
                <input type="file" id="edit-item-file-input" accept="image/png,image/jpeg,image/webp" style="font-size: 11px; width: 100%; margin-bottom: 6px;" />
                <div style="display: flex; gap: 6px;">
                  <input type="text" id="edit-item-url-input" placeholder="Or enter image URL" value="${chosenImage.startsWith("data:") ? "" : escapeHtml(chosenImage)}" style="flex-grow: 1; padding: 4px 8px; border: 1px solid var(--c-border); border-radius: var(--radius-sm); font-size: 11px;" />
                  <button type="button" class="btn btn--outline btn--xs" id="edit-item-apply-url-btn" style="white-space: nowrap;">Apply</button>
                </div>
              </div>
            </div>

            <!-- Presets -->
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${SAMPLE_PHOTOS.map((p) => `<button type="button" class="btn btn--outline btn--xs edit-preset-btn" data-url="${p.url}" style="font-size: 10px; padding: 3px 8px;">${escapeHtml(p.label)}</button>`).join("")}
            </div>
          </div>

          <!-- Bottom Actions -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 14px; border-top: 1px solid var(--c-border);">
            <button class="btn btn--danger btn--sm" type="button" id="delete-listing-btn" style="color: #b23b2e; border: 1px solid #fecaca; background: #fef2f2;">
              🗑️ Delete Listing
            </button>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn--outline btn--sm" type="button" id="cancel-edit-item-btn">Cancel</button>
              <button class="btn btn--solid btn--sm" type="submit">Save Changes</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;
    overlay.style.display = "flex";
    overlay.classList.add("modal-overlay--open");
    const closeBtn = overlay.querySelector(".modal-close");
    const cancelBtn = document.getElementById("cancel-edit-item-btn");
    const form = document.getElementById("edit-item-form");
    const deleteBtn = document.getElementById("delete-listing-btn");
    const listingTypeSelect = document.getElementById("edit-listing-type");
    const wishGroup = document.getElementById("edit-exchange-wish-group");
    const previewImg = document.getElementById("edit-item-preview-img");
    const fileInput = document.getElementById("edit-item-file-input");
    const urlInput = document.getElementById("edit-item-url-input");
    const applyUrlBtn = document.getElementById("edit-item-apply-url-btn");
    closeBtn?.addEventListener("click", closeEditItemModal);
    cancelBtn?.addEventListener("click", closeEditItemModal);
    // Type change -> toggle wishlist field
    listingTypeSelect?.addEventListener("change", () => {
        currentType = listingTypeSelect.value;
        if (wishGroup) {
            wishGroup.style.display = currentType === "Exchange" ? "block" : "none";
        }
    });
    // Photo handlers
    fileInput?.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const res = e.target?.result;
            if (res) {
                chosenImage = res;
                if (previewImg)
                    previewImg.src = res;
            }
        };
        reader.readAsDataURL(file);
    });
    applyUrlBtn?.addEventListener("click", () => {
        const val = urlInput?.value.trim();
        if (val) {
            chosenImage = val;
            if (previewImg)
                previewImg.src = val;
        }
    });
    overlay.querySelectorAll(".edit-preset-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const url = btn.dataset.url;
            if (url) {
                chosenImage = url;
                if (previewImg)
                    previewImg.src = url;
                if (urlInput)
                    urlInput.value = url;
            }
        });
    });
    // Delete listing action
    deleteBtn?.addEventListener("click", () => {
        if (confirm(`Are you sure you want to permanently delete "${item.title}"? This cannot be undone.`)) {
            deleteItem(item.id, activeUser.name);
            addUserNotification(activeUser.id, {
                title: "Listing Removed",
                message: `Your listing "${item.title}" has been removed.`,
                tag: "Item",
            });
            closeEditItemModal();
            if (onDeleted)
                onDeleted();
            else if (onSaved)
                onSaved({ ...item, hidden: true });
        }
    });
    // Submit save
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const titleInput = document.getElementById("edit-title");
        const categorySelect = document.getElementById("edit-category");
        const conditionSelect = document.getElementById("edit-condition");
        const statusSelect = document.getElementById("edit-status");
        const wishInput = document.getElementById("edit-exchange-wish");
        const coinsInput = document.getElementById("edit-coins");
        const descInput = document.getElementById("edit-description");
        const newTitle = titleInput.value.trim();
        if (!newTitle) {
            alert("Please enter a title for the item.");
            titleInput.focus();
            return;
        }
        const updates = {
            title: newTitle,
            category: categorySelect.value,
            condition: conditionSelect.value,
            listingType: listingTypeSelect.value,
            exchangeFor: listingTypeSelect.value === "Exchange" ? wishInput.value.trim() : undefined,
            status: statusSelect.value,
            coins: Number(coinsInput.value) || item.coins,
            description: descInput.value.trim() || item.description,
            details: `${conditionSelect.value} condition · ${categorySelect.value}`,
            image: chosenImage,
        };
        updateItem(item.id, updates);
        addUserNotification(activeUser.id, {
            title: "Listing Updated",
            message: `Your listing "${newTitle}" has been updated.`,
            tag: "Item",
        });
        closeEditItemModal();
        if (onSaved)
            onSaved({ ...item, ...updates });
    });
}
