import { logoutUser } from "../data/profileData.js";

export function mountLogout(): void {
  const handleLogout = (): void => {
    if (!confirm("Log out of Villa-Reuse?")) return;
    logoutUser();
    window.location.href = "login.html";
  };

  document.querySelectorAll<HTMLElement>('[data-logout]').forEach((button) => {
    button.addEventListener("click", handleLogout);
  });
}
