import { getActiveUser, updateUserProfile, Profile } from "../data/profileData.js";
import { openEditAvatarModal } from "./editAvatarModal.js";

function escapeHtml(value: string): string {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

let activeOverlay: HTMLElement | null = null;
let escHandler: ((e: KeyboardEvent) => void) | null = null;

export function closeEditProfileModal(): void {
  if (activeOverlay) {
    activeOverlay.classList.remove("modal-overlay--open");
    activeOverlay.style.display = "none";
  }
  if (escHandler) {
    document.removeEventListener("keydown", escHandler);
    escHandler = null;
  }
}

export function openEditProfileModal(onUpdate?: (updatedUser: Profile) => void): void {
  const user = getActiveUser();

  let overlay = document.getElementById("edit-profile-modal-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "edit-profile-modal-overlay";
    overlay.className = "modal-overlay";
    document.body.append(overlay);
  }
  activeOverlay = overlay;

  if (escHandler) document.removeEventListener("keydown", escHandler);
  escHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeEditProfileModal();
  };
  document.addEventListener("keydown", escHandler);

  overlay.onclick = (e) => {
    if (e.target === overlay) closeEditProfileModal();
  };

  overlay.innerHTML = `
    <div class="modal-dialog activity-dialog" style="max-width: 520px;" role="dialog" aria-modal="true">
      <button class="modal-close" type="button" aria-label="Close dialog">&times;</button>
      
      <div class="act-body">
        <div class="act-header">
          <div class="act-header__left">
            <span class="act-badge act-badge--green">${escapeHtml(user.role)}</span>
            <h2 class="act-title">Edit Your Profile</h2>
            <p class="act-subtitle">Update your public display information and neighborhood location.</p>
          </div>
        </div>

        <form class="act-form" id="edit-profile-form">
          <div style="display:flex; align-items:center; gap:14px; margin-bottom:16px; padding:12px; background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--radius-sm);">
            <div style="width:48px; height:48px; border-radius:50%; overflow:hidden; background:var(--c-green-100); display:grid; place-items:center; font-family:var(--font-serif); font-weight:700; color:var(--c-green-900); flex-shrink:0;">
              ${user.avatar ? `<img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}" style="width:100%; height:100%; object-fit:cover; display:block;" />` : escapeHtml(user.initials)}
            </div>
            <div style="flex-grow:1;">
              <p style="margin:0; font-size:12px; font-weight:700; color:var(--c-text);">Profile Photo</p>
              <p style="margin:2px 0 0; font-size:11px; color:var(--c-muted);">Upload or choose your display picture.</p>
            </div>
            <button type="button" id="edit-profile-avatar-trigger" class="btn btn--outline btn--xs" style="font-size:11px;">Edit Photo</button>
          </div>

          <div class="field" style="margin-bottom: 14px;">
            <label class="field__label" for="edit-name" style="font-weight:700; font-size:12px; display:block; margin-bottom:4px;">Full Name <span style="color:#b23b2e;">*</span></label>
            <input class="field__input" id="edit-name" type="text" required value="${escapeHtml(user.name)}" style="width:100%; padding:10px 12px; border:1px solid var(--c-border); border-radius:var(--radius-sm);" />
          </div>

          <div class="field" style="margin-bottom: 14px;">
            <label class="field__label" for="edit-email" style="font-weight:700; font-size:12px; display:block; margin-bottom:4px;">Email Address <span style="color:#b23b2e;">*</span></label>
            <input class="field__input" id="edit-email" type="email" required value="${escapeHtml(user.email)}" style="width:100%; padding:10px 12px; border:1px solid var(--c-border); border-radius:var(--radius-sm);" />
          </div>

          <div class="field" style="margin-bottom: 14px;">
            <label class="field__label" for="edit-neighborhood" style="font-weight:700; font-size:12px; display:block; margin-bottom:4px;">Neighborhood / District <span style="color:#b23b2e;">*</span></label>
            <input class="field__input" id="edit-neighborhood" type="text" required value="${escapeHtml(user.neighborhood)}" placeholder="e.g. Downtown Villa" style="width:100%; padding:10px 12px; border:1px solid var(--c-border); border-radius:var(--radius-sm);" />
          </div>

          <div class="field" style="margin-bottom: 20px;">
            <label class="field__label" for="edit-role-scope" style="font-weight:700; font-size:12px; display:block; margin-bottom:4px;">Bio & Community Scope</label>
            <textarea class="field__input" id="edit-role-scope" rows="3" style="width:100%; padding:10px 12px; border:1px solid var(--c-border); border-radius:var(--radius-sm); font-family:var(--font-sans);">${escapeHtml(user.roleScope)}</textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn btn--outline" type="button" id="cancel-edit-profile">Cancel</button>
            <button class="btn btn--solid" type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;

  overlay.style.display = "flex";
  overlay.classList.add("modal-overlay--open");

  overlay.querySelector(".modal-close")?.addEventListener("click", closeEditProfileModal);
  document.getElementById("cancel-edit-profile")?.addEventListener("click", closeEditProfileModal);
  document.getElementById("edit-profile-avatar-trigger")?.addEventListener("click", () => {
    closeEditProfileModal();
    openEditAvatarModal((updated) => {
      if (onUpdate) onUpdate(updated);
    });
  });

  const form = document.getElementById("edit-profile-form") as HTMLFormElement;
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("edit-name") as HTMLInputElement;
    const emailInput = document.getElementById("edit-email") as HTMLInputElement;
    const neighborhoodInput = document.getElementById("edit-neighborhood") as HTMLInputElement;
    const scopeInput = document.getElementById("edit-role-scope") as HTMLTextAreaElement;

    if (!nameInput.value.trim() || !emailInput.value.trim()) return;

    const updated = updateUserProfile({
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      neighborhood: neighborhoodInput.value.trim() || user.neighborhood,
      roleScope: scopeInput.value.trim() || user.roleScope,
    });

    closeEditProfileModal();
    if (onUpdate) onUpdate(updated);
  });
}
