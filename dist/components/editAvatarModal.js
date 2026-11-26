import { getActiveUser, updateUserProfile } from "../data/profileData.js";
function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}
// Preset avatars with friendly themes
export const PRESET_AVATARS = [
    {
        label: "Fresh Leaf (Green)",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%231f7a3f'/><circle cx='50' cy='38' r='18' fill='%23dcfce7'/><path d='M25 85c0-14 11-24 25-24s25 10 25 24' fill='%23dcfce7'/></svg>",
    },
    {
        label: "Warm Sun (Amber)",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%23d97706'/><circle cx='50' cy='38' r='18' fill='%23fef3c7'/><path d='M25 85c0-14 11-24 25-24s25 10 25 24' fill='%23fef3c7'/></svg>",
    },
    {
        label: "Ocean Calm (Teal)",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%230d9488'/><circle cx='50' cy='38' r='18' fill='%23ccfbf1'/><path d='M25 85c0-14 11-24 25-24s25 10 25 24' fill='%23ccfbf1'/></svg>",
    },
    {
        label: "Community Royal (Indigo)",
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%234f46e5'/><circle cx='50' cy='38' r='18' fill='%23e0e7ff'/><path d='M25 85c0-14 11-24 25-24s25 10 25 24' fill='%23e0e7ff'/></svg>",
    },
];
let activeOverlay = null;
let escHandler = null;
export function closeEditAvatarModal() {
    if (activeOverlay) {
        activeOverlay.classList.remove("modal-overlay--open");
        activeOverlay.style.display = "none";
    }
    if (escHandler) {
        document.removeEventListener("keydown", escHandler);
        escHandler = null;
    }
}
export function openEditAvatarModal(onSaved) {
    const user = getActiveUser();
    let overlay = document.getElementById("edit-avatar-modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "edit-avatar-modal-overlay";
        overlay.className = "modal-overlay";
        overlay.style.zIndex = "260";
        document.body.append(overlay);
    }
    else {
        overlay.style.zIndex = "260";
    }
    activeOverlay = overlay;
    if (escHandler)
        document.removeEventListener("keydown", escHandler);
    escHandler = (e) => {
        if (e.key === "Escape")
            closeEditAvatarModal();
    };
    document.addEventListener("keydown", escHandler);
    overlay.onclick = (e) => {
        if (e.target === overlay)
            closeEditAvatarModal();
    };
    let chosenAvatar = user.avatar || "";
    function updatePreviewDisplay() {
        const previewContainer = document.getElementById("avatar-preview-display");
        const previewSource = document.getElementById("avatar-preview-source");
        if (!previewContainer)
            return;
        if (chosenAvatar) {
            previewContainer.innerHTML = `<img src="${chosenAvatar}" alt="${escapeHtml(user.name)}" style="width:100%; height:100%; object-fit:cover; border-radius:50%; display:block;" />`;
            if (previewSource) {
                previewSource.textContent = chosenAvatar.startsWith("data:") ? "Custom Image Selected" : chosenAvatar;
            }
        }
        else {
            previewContainer.innerHTML = `<div style="width:100%; height:100%; border-radius:50%; background:var(--c-green-100); color:var(--c-green-900); display:grid; place-items:center; font-family:var(--font-serif); font-size:32px; font-weight:700;">${escapeHtml(user.initials)}</div>`;
            if (previewSource) {
                previewSource.textContent = "Default Initials (" + user.initials + ")";
            }
        }
    }
    overlay.innerHTML = `
    <div class="modal-dialog activity-dialog" style="max-width: 500px; max-height: 88vh; overflow-y: auto; padding: 22px 24px;" role="dialog" aria-modal="true" aria-labelledby="edit-avatar-title">
      <button class="modal-close" type="button" aria-label="Close dialog">&times;</button>
      
      <div class="act-body" style="padding:0;">
        <div class="act-header" style="margin-bottom:14px;">
          <div class="act-header__left">
            <span class="act-badge act-badge--green">${escapeHtml(user.role)}</span>
            <h2 class="act-title" id="edit-avatar-title" style="font-size:20px; margin:4px 0 2px;">Edit Profile Photo</h2>
            <p class="act-subtitle" style="font-size:12px; margin:0;">Customize the photo displayed for <strong>${escapeHtml(user.name)}</strong>.</p>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <!-- Preview Box: Compact side-by-side -->
          <div style="display:flex; align-items:center; gap:16px; background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--radius-md); padding:12px 16px;">
            <div id="avatar-preview-display" style="width:72px; height:72px; border-radius:50%; overflow:hidden; border:2px solid var(--c-border); background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.08); display:grid; place-items:center; flex-shrink:0;">
              <!-- Rendered via updatePreviewDisplay() -->
            </div>
            <div style="flex-grow:1; min-width:0;">
              <p style="font-size:10px; font-weight:700; color:var(--c-muted); text-transform:uppercase; margin:0 0 4px; letter-spacing:0.05em;">Live Preview</p>
              <span id="avatar-preview-source" style="font-size:11px; color:var(--c-text); display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"></span>
              <button type="button" id="reset-avatar-initials" style="margin-top:6px; font-size:11px; color:#b23b2e; background:none; border:none; cursor:pointer; text-decoration:underline; padding:0;">
                Reset to Initials
              </button>
            </div>
          </div>

          <!-- Option 1: Upload from Device -->
          <div style="background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--radius-md); padding:10px 14px;">
            <label style="font-size:11px; font-weight:700; color:var(--c-text); display:block; margin-bottom:4px;">1. Upload from Computer (PNG or JPG)</label>
            <input type="file" id="edit-avatar-file-input" accept="image/png,image/jpeg,image/webp,image/gif" style="font-size:11px; width:100%;" />
          </div>

          <!-- Option 2: Enter URL -->
          <div style="background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--radius-md); padding:10px 14px;">
            <label for="edit-avatar-url-input" style="font-size:11px; font-weight:700; color:var(--c-text); display:block; margin-bottom:4px;">2. Or Enter Image URL / Asset Path</label>
            <div style="display:flex; gap:8px;">
              <input type="text" id="edit-avatar-url-input" placeholder="e.g. assets/denim-jacket.png" value="${chosenAvatar && !chosenAvatar.startsWith('data:') ? escapeHtml(chosenAvatar) : ''}" style="flex-grow:1; padding:6px 10px; border:1px solid var(--c-border); border-radius:var(--radius-sm); font-size:11px;" />
              <button type="button" class="btn btn--outline btn--xs" id="edit-avatar-apply-url" style="white-space:nowrap; padding:4px 10px;">Apply</button>
            </div>
          </div>

          <!-- Option 3: Community Preset Avatars -->
          <div style="background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--radius-md); padding:10px 14px;">
            <label style="font-size:11px; font-weight:700; color:var(--c-text); display:block; margin-bottom:6px;">3. Or Pick a Preset Community Avatar</label>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
              ${PRESET_AVATARS.map((preset, idx) => `
                <button type="button" class="preset-avatar-btn" data-preset-idx="${idx}" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px 4px; background:var(--c-surface); border:1.5px solid var(--c-border); border-radius:var(--radius-sm); cursor:pointer; transition:border-color 0.15s, transform 0.1s;">
                  <img src="${preset.url}" alt="${escapeHtml(preset.label)}" style="width:34px; height:34px; border-radius:50%; object-fit:cover;" />
                  <span style="font-size:9px; font-weight:600; color:var(--c-text); text-align:center; line-height:1.1;">${escapeHtml(preset.label.split(" ")[0])}</span>
                </button>
              `).join("")}
            </div>
          </div>

          <!-- Error or notice -->
          <div id="avatar-modal-alert" style="display:none; padding:6px 10px; font-size:11px; border-radius:var(--radius-sm); color:#b23b2e; background:#fdedec; border:1px solid #f5c2c0;"></div>

          <!-- Actions -->
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:2px;">
            <button class="btn btn--outline btn--sm" type="button" id="cancel-edit-avatar">Cancel</button>
            <button class="btn btn--solid btn--sm" type="button" id="save-edit-avatar">Save Photo</button>
          </div>
        </div>
      </div>
    </div>
  `;
    overlay.style.display = "flex";
    overlay.classList.add("modal-overlay--open");
    updatePreviewDisplay();
    const closeBtn = overlay.querySelector(".modal-close");
    const cancelBtn = document.getElementById("cancel-edit-avatar");
    const saveBtn = document.getElementById("save-edit-avatar");
    const fileInput = document.getElementById("edit-avatar-file-input");
    const urlInput = document.getElementById("edit-avatar-url-input");
    const applyUrlBtn = document.getElementById("edit-avatar-apply-url");
    const resetBtn = document.getElementById("reset-avatar-initials");
    const alertEl = document.getElementById("avatar-modal-alert");
    function showAlert(msg) {
        if (alertEl) {
            alertEl.textContent = msg;
            alertEl.style.display = "block";
        }
    }
    function hideAlert() {
        if (alertEl)
            alertEl.style.display = "none";
    }
    closeBtn?.addEventListener("click", closeEditAvatarModal);
    cancelBtn?.addEventListener("click", closeEditAvatarModal);
    // File upload handler
    fileInput?.addEventListener("change", () => {
        hideAlert();
        const file = fileInput.files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith("image/")) {
            showAlert("Please choose an image file (PNG, JPG, WebP, etc.).");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
                chosenAvatar = result;
                updatePreviewDisplay();
            }
        };
        reader.onerror = () => {
            showAlert("Failed to read the image file from your device.");
        };
        reader.readAsDataURL(file);
    });
    // URL Apply handler
    applyUrlBtn?.addEventListener("click", () => {
        hideAlert();
        const val = urlInput?.value.trim() || "";
        if (!val) {
            showAlert("Please enter an image URL or asset path.");
            return;
        }
        chosenAvatar = val;
        updatePreviewDisplay();
    });
    // Preset buttons
    overlay.querySelectorAll(".preset-avatar-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            hideAlert();
            const idx = Number(btn.dataset.presetIdx);
            const preset = PRESET_AVATARS[idx];
            if (preset) {
                chosenAvatar = preset.url;
                updatePreviewDisplay();
            }
        });
    });
    // Reset to initials
    resetBtn?.addEventListener("click", () => {
        hideAlert();
        chosenAvatar = "";
        if (urlInput)
            urlInput.value = "";
        if (fileInput)
            fileInput.value = "";
        updatePreviewDisplay();
    });
    // Save changes
    saveBtn?.addEventListener("click", () => {
        const updated = updateUserProfile({ avatar: chosenAvatar });
        closeEditAvatarModal();
        onSaved?.(updated);
    });
}
