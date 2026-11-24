import type { Profile } from "../data/profileData.js";

export function renderProfile(profile: Profile): void {
  const avatarEl = document.getElementById("profile-avatar");
  if (avatarEl) avatarEl.textContent = profile.initials;

  const headerAvatarEl = document.querySelector(".header .avatar");
  if (headerAvatarEl) headerAvatarEl.textContent = profile.initials;

  const nameEl = document.getElementById("profile-name");
  if (nameEl) nameEl.textContent = profile.name;

  const emailEl = document.getElementById("profile-email");
  if (emailEl) emailEl.textContent = profile.email;

  const metaEl = document.getElementById("profile-meta");
  if (metaEl) {
    metaEl.textContent = `${profile.neighborhood} · Member since ${profile.memberSince}`;
  }

  const roleEl = document.getElementById("profile-role");
  if (roleEl) roleEl.textContent = profile.role;

  const roleScopeEl = document.getElementById("profile-role-scope");
  if (roleScopeEl) roleScopeEl.textContent = profile.roleScope;

  const balanceEl = document.getElementById("profile-balance");
  if (balanceEl) balanceEl.textContent = String(profile.coins);

  const headerBalanceEl = document.getElementById("header-balance");
  if (headerBalanceEl) headerBalanceEl.textContent = String(profile.coins);

  const coinBalanceEl = document.getElementById("coin-balance");
  if (coinBalanceEl) coinBalanceEl.textContent = String(profile.coins);

  const itemsEl = document.getElementById("figure-items");
  if (itemsEl) itemsEl.textContent = String(profile.itemsShared);

  const wasteEl = document.getElementById("figure-waste");
  if (wasteEl) wasteEl.textContent = `${profile.wasteSavedKg} kg`;
}
