import type { Profile } from "../data/profileData.js";
import { getActiveUser, getUserNotifications } from "../data/profileData.js";
import { openActivityModal } from "./activityModal.js";

export function syncNavigation(user?: Profile): Profile {
  const activeUser = user || getActiveUser();

  // 1. Sync Header Avatar & Profile Click
  const avatarEl = document.querySelector<HTMLElement>(".header .avatar");
  if (avatarEl) {
    avatarEl.textContent = activeUser.initials;
    avatarEl.title = `${activeUser.name} (${activeUser.role}) · Click to open Profile`;
    avatarEl.style.cursor = "pointer";
    avatarEl.onclick = () => {
      window.location.href = "profile.html";
    };
  }

  // 2. Sync Coin Balance
  const balanceEl =
    document.getElementById("header-balance") ||
    document.getElementById("coin-balance") ||
    document.querySelector<HTMLElement>(".header .coins__value");
  if (balanceEl) {
    balanceEl.textContent = String(activeUser.coins);
  }

  // 3. Sync Notification Button on topbar
  let notifBtn = document.querySelector<HTMLButtonElement>(
    '.header button[aria-label="Notifications"], .header .icon-btn[aria-label="Notifications"]'
  );

  const headerActions = document.querySelector<HTMLElement>(".header__actions");
  if (!notifBtn && headerActions) {
    notifBtn = document.createElement("button");
    notifBtn.className = "icon-btn";
    notifBtn.type = "button";
    notifBtn.setAttribute("aria-label", "Notifications");
    notifBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
      <span class="icon-btn__badge">0</span>
    `;
    const targetBefore = avatarEl || headerActions.firstChild;
    headerActions.insertBefore(notifBtn, targetBefore);
  }

  if (notifBtn) {
    const notifs = getUserNotifications(activeUser.id);
    const unreadCount = notifs.filter((n) => !n.read).length;
    let badge = notifBtn.querySelector<HTMLElement>(".icon-btn__badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "icon-btn__badge";
      notifBtn.append(badge);
    }
    if (unreadCount > 0) {
      badge.style.display = "grid";
      badge.textContent = String(unreadCount);
    } else {
      badge.style.display = "none";
    }

    notifBtn.onclick = () => {
      openActivityModal("notifications", () => {
        syncNavigation(activeUser);
      });
    };
  }

  // 4. Role-based Navigation Access Control:
  const modLinks = document.querySelectorAll<HTMLElement>(
    'a[href="moderation.html"], [data-nav="moderation"]'
  );
  modLinks.forEach((el) => {
    if (activeUser.role === "Community Moderator") {
      el.style.display = "flex";
    } else {
      el.style.display = "none";
    }
  });

  const adminLinks = document.querySelectorAll<HTMLElement>(
    'a[href="admin.html"], [data-nav="admin"]'
  );
  adminLinks.forEach((el) => {
    if (activeUser.role === "System Administrator") {
      el.style.display = "flex";
    } else {
      el.style.display = "none";
    }
  });

  return activeUser;
}
