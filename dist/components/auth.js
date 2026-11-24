import { logoutUser } from "../data/profileData.js";
export function mountLogout() {
    const handleLogout = () => {
        if (!confirm("Log out of Villa-Reuse?"))
            return;
        logoutUser();
        window.location.href = "login.html";
    };
    document.querySelectorAll('[data-logout]').forEach((button) => {
        button.addEventListener("click", handleLogout);
    });
}
