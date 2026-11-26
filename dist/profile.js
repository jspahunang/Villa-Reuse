import { getActiveUser, getUserActivities } from "./data/profileData.js";
import { renderProfile } from "./components/profileCard.js";
import { createActivityRow } from "./components/activityList.js";
import { syncNavigation } from "./components/navigation.js";
import { mountLogout } from "./components/auth.js";
import { openActivityModal } from "./components/activityModal.js";
import { openEditProfileModal } from "./components/editProfileModal.js";
import { openEditAvatarModal } from "./components/editAvatarModal.js";
function requireElement(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Missing element #${id}`);
    return el;
}
function bootstrap() {
    const list = requireElement("activity-list");
    const editBtn = requireElement("edit-profile");
    function renderAll() {
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
        const row = event.target.closest(".activity-row");
        if (!row || !row.dataset.id)
            return;
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
    // Edit Avatar button & avatar click
    const handleOpenAvatar = () => {
        openEditAvatarModal(() => {
            renderAll();
        });
    };
    document.getElementById("edit-avatar-btn")?.addEventListener("click", handleOpenAvatar);
    document.getElementById("edit-avatar-badge")?.addEventListener("click", handleOpenAvatar);
    document.getElementById("profile-avatar")?.addEventListener("click", handleOpenAvatar);
}
bootstrap();
