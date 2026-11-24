import { getActiveUser, ACTIVITY } from "./data/profileData.js";
import { renderProfile } from "./components/profileCard.js";
import { createActivityRow } from "./components/activityList.js";
import { syncNavigation } from "./components/navigation.js";
import { mountLogout } from "./components/auth.js";

function requireElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

function bootstrap(): void {
  const activeUser = getActiveUser();
  syncNavigation(activeUser);
  renderProfile(activeUser);
  mountLogout();


  const list = requireElement<HTMLUListElement>("activity-list");
  list.append(...ACTIVITY.map(createActivityRow));

  list.addEventListener("click", (event) => {
    const row = (event.target as HTMLElement).closest<HTMLButtonElement>(".activity-row");
    if (row) console.log("Open activity:", row.dataset.id);
  });

  requireElement<HTMLButtonElement>("edit-profile").addEventListener("click", () => {
    alert(`Editing profile for ${activeUser.name} (${activeUser.role}).`);
  });
}

bootstrap();
