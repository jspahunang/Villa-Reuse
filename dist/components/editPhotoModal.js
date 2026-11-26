import { updateItem } from "../data/systemStore.js";
function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}
const PRESET_PHOTOS = [
    { label: "Apparel / Jacket", url: "assets/denim-jacket.png" },
    { label: "Electronics / Kettle", url: "assets/electric-kettle.png" },
    { label: "Books / Supplies", url: "assets/design-handbook.png" },
    { label: "Household / Dinnerware", url: "assets/ceramic-table-set.png" },
];
let activeOverlay = null;
let escHandler = null;
export function closeEditPhotoModal() {
    if (activeOverlay) {
        activeOverlay.classList.remove("modal-overlay--open");
        activeOverlay.style.display = "none";
    }
    if (escHandler) {
        document.removeEventListener("keydown", escHandler);
        escHandler = null;
    }
}
export function openEditPhotoModal(item, onSaved) {
    let overlay = document.getElementById("edit-photo-modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "edit-photo-modal-overlay";
        overlay.className = "modal-overlay";
        overlay.style.zIndex = "250";
        document.body.append(overlay);
    }
    else {
        overlay.style.zIndex = "250";
    }
    activeOverlay = overlay;
    if (escHandler)
        document.removeEventListener("keydown", escHandler);
    escHandler = (e) => {
        if (e.key === "Escape")
            closeEditPhotoModal();
    };
    document.addEventListener("keydown", escHandler);
    overlay.onclick = (e) => {
        if (e.target === overlay)
            closeEditPhotoModal();
    };
    let chosenImage = item.image;
    overlay.innerHTML = `
    <div class="modal-dialog activity-dialog" style="max-width: 560px;" role="dialog" aria-modal="true">
      <button class="modal-close" type="button" aria-label="Close dialog">&times;</button>
      
      <div class="act-body">
        <div class="act-header">
          <div class="act-header__left">
            <span class="act-badge act-badge--green">Item Media Editor</span>
            <h2 class="act-title">Edit Listing Picture</h2>
            <p class="act-subtitle">Update the photo displayed for <strong>${escapeHtml(item.title)}</strong>.</p>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:16px;">
          <!-- Preview Box -->
          <div style="display:flex; flex-direction:column; align-items:center; background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--radius-md); padding:16px;">
            <p style="font-size:11px; font-weight:700; color:var(--c-muted); text-transform:uppercase; margin:0 0 10px; letter-spacing:0.05em;">Picture Preview</p>
            <div style="width:200px; height:140px; border-radius:var(--radius-sm); overflow:hidden; border:1px solid var(--c-border); background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
              <img id="edit-photo-preview" src="${escapeHtml(chosenImage)}" alt="Preview" style="width:100%; height:100%; object-fit:cover; display:block;" />
            </div>
            <span id="edit-photo-source" style="font-size:10px; color:var(--c-muted); margin-top:8px; max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Current: ${escapeHtml(chosenImage)}</span>
          </div>

          <!-- Method 1: Upload from Computer -->
          <div style="background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--radius-md); padding:14px 16px;">
            <label style="font-size:12px; font-weight:700; color:var(--c-text); display:block; margin-bottom:4px;">1. Upload New Image (JPG or PNG)</label>
            <p style="font-size:11px; color:var(--c-muted); margin:0 0 8px;">Select a photo from your device. It will be stored in your browser.</p>
            <input type="file" id="edit-photo-file-input" accept="image/png,image/jpeg" style="font-size:12px; width:100%;" />
          </div>

          <!-- Method 2: Enter URL -->
          <div style="background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--radius-md); padding:14px 16px;">
            <label for="edit-photo-url-input" style="font-size:12px; font-weight:700; color:var(--c-text); display:block; margin-bottom:4px;">2. Or Enter Image URL / Asset Path</label>
            <div style="display:flex; gap:8px;">
              <input type="text" id="edit-photo-url-input" placeholder="e.g. https://... or assets/denim-jacket.png" value="${escapeHtml(chosenImage)}" style="flex-grow:1; padding:8px 10px; border:1px solid var(--c-border); border-radius:var(--radius-sm); font-size:12px;" />
              <button type="button" class="btn btn--outline btn--xs" id="edit-photo-apply-url" style="white-space:nowrap;">Apply</button>
            </div>
          </div>

          <!-- Method 3: Choose Preset Photo -->
          <div style="background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--radius-md); padding:14px 16px;">
            <label style="font-size:12px; font-weight:700; color:var(--c-text); display:block; margin-bottom:8px;">3. Or Choose from Sample Community Photos</label>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
              ${PRESET_PHOTOS.map((preset) => `
                <button type="button" class="btn-preset-photo" data-url="${preset.url}" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; background:#fff; border:1px solid var(--c-border); border-radius:var(--radius-sm); cursor:pointer; text-align:center;">
                  <img src="${preset.url}" alt="${preset.label}" style="width:100%; height:48px; object-fit:cover; border-radius:4px;" />
                  <span style="font-size:9px; font-weight:600; color:var(--c-text); line-height:1.2;">${preset.label}</span>
                </button>
              `).join("")}
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; justify-content:flex-end; gap:10px; padding-top:8px;">
            <button class="btn btn--outline" type="button" id="cancel-edit-photo">Cancel</button>
            <button class="btn btn--solid" type="button" id="save-edit-photo">Save Picture</button>
          </div>
        </div>
      </div>
    </div>
  `;
    overlay.style.display = "flex";
    overlay.classList.add("modal-overlay--open");
    overlay.querySelector(".modal-close")?.addEventListener("click", closeEditPhotoModal);
    document.getElementById("cancel-edit-photo")?.addEventListener("click", closeEditPhotoModal);
    const previewEl = document.getElementById("edit-photo-preview");
    const sourceEl = document.getElementById("edit-photo-source");
    const urlInput = document.getElementById("edit-photo-url-input");
    const fileInput = document.getElementById("edit-photo-file-input");
    function updatePreview(newUrl) {
        chosenImage = newUrl;
        if (previewEl)
            previewEl.src = newUrl;
        if (sourceEl)
            sourceEl.textContent = `Selected: ${newUrl.slice(0, 40)}...`;
        if (urlInput)
            urlInput.value = newUrl.startsWith("data:") ? "[Uploaded Image Data]" : newUrl;
    }
    // Handle URL apply & input events
    const applyUrl = () => {
        const val = urlInput?.value.trim();
        if (val && !val.startsWith("[Uploaded")) {
            updatePreview(val);
        }
    };
    document.getElementById("edit-photo-apply-url")?.addEventListener("click", applyUrl);
    urlInput?.addEventListener("change", applyUrl);
    urlInput?.addEventListener("blur", applyUrl);
    // Handle Preset Clicks
    overlay.querySelectorAll(".btn-preset-photo").forEach((btn) => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const url = btn.dataset.url;
            if (url)
                updatePreview(url);
        };
    });
    // Handle File Upload (converts to Data URL so it persists in localStorage)
    fileInput?.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith("image/")) {
            alert("Please choose a valid JPG or PNG image.");
            fileInput.value = "";
            return;
        }
        if (file.size > 8 * 1024 * 1024) {
            alert("Image is larger than 8MB. Please choose a smaller photo.");
            fileInput.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            const res = ev.target?.result;
            if (typeof res === "string") {
                updatePreview(res);
            }
        };
        reader.readAsDataURL(file);
    });
    // Handle Save
    const saveBtn = overlay.querySelector("#save-edit-photo");
    if (saveBtn) {
        saveBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            item.image = chosenImage;
            updateItem(item.id, { image: chosenImage });
            closeEditPhotoModal();
            if (onSaved)
                onSaved(chosenImage);
        };
    }
}
