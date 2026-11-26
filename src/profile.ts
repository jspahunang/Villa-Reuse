import { getActiveUser, getUserActivities } from "./data/profileData.js";
import { renderProfile } from "./components/profileCard.js";
import { createActivityRow } from "./components/activityList.js";
import { syncNavigation } from "./components/navigation.js";
import { mountLogout } from "./components/auth.js";
import { openActivityModal } from "./components/activityModal.js";
import { openEditProfileModal } from "./components/editProfileModal.js";

function requireElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

function bootstrap(): void {
  const list = requireElement<HTMLUListElement>("activity-list");
  const editBtn = requireElement<HTMLButtonElement>("edit-profile");

  function renderAll(): void {
    const activeUser = getActiveUser();
    syncNavigation(activeUser);
    renderProfile(activeUser);

    // Refresh dynamic activities with up-to-date counts
    const activities = getUserActivities(activeUser);
    list.replaceChildren(...activities.map(createActivityRow));
  }

  // Initial load
  mountLogout();
  renderAll();

  // Activity list click delegation
  list.addEventListener("click", (event) => {
    const row = (event.target as HTMLElement).closest<HTMLButtonElement>(".activity-row");
    if (!row || !row.dataset.id) return;
    openActivityModal(row.dataset.id, () => {
      renderAll();
    });
  });

  // Edit profile button
  editBtn.addEventListener("click", () => {
    openEditProfileModal(() => {
      renderAll();
    });
  });
}

bootstrap();
