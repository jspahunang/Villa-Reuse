import { DEMO_USERS, setActiveUser } from "./data/profileData.js";
import { syncNavigation } from "./components/navigation.js";
const DEMO_PASSWORD = "villa2026";
const ROLE_HOME = {
    member: "index.html",
    donor: "requests.html",
    moderator: "moderation.html",
    admin: "admin.html",
};
function bootstrap() {
    syncNavigation();
    const form = document.getElementById("login-form");
    if (!(form instanceof HTMLFormElement))
        return;
    const pageRole = document.body.dataset.pageRole || "";
    const account = DEMO_USERS[pageRole];
    if (!account)
        return;
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const togglePassBtn = document.getElementById("toggle-password");
    const submitBtn = document.getElementById("submit-login-btn");
    const alertBox = document.getElementById("login-alert");
    if (!(emailInput instanceof HTMLInputElement) ||
        !(passwordInput instanceof HTMLInputElement) ||
        !(togglePassBtn instanceof HTMLButtonElement) ||
        !(submitBtn instanceof HTMLButtonElement) ||
        !alertBox) {
        return;
    }
    const alert = alertBox;
    emailInput.value = account.email;
    emailInput.readOnly = true;
    passwordInput.value = DEMO_PASSWORD;
    function showAlert(message, isError = false) {
        alert.textContent = message;
        alert.className = `login-alert ${isError ? "login-alert--error" : "login-alert--success"}`;
        alert.style.display = "block";
    }
    function hideAlert() {
        alert.style.display = "none";
    }
    togglePassBtn.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        togglePassBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        hideAlert();
        const email = emailInput.value.trim().toLowerCase();
        const pass = passwordInput.value.trim();
        if (email !== account.email.toLowerCase()) {
            showAlert(`This page is only for ${account.name}. Use ${account.email}.`, true);
            return;
        }
        if (!pass) {
            showAlert("Please enter your password.", true);
            passwordInput.focus();
            return;
        }
        if (pass !== DEMO_PASSWORD) {
            showAlert("That password does not match this account. Use villa2026.", true);
            passwordInput.focus();
            return;
        }
        submitBtn.disabled = true;
        submitBtn.textContent = "Signing in...";
        setActiveUser(account);
        showAlert(`Welcome, ${account.name}. Opening your ${account.role} tools.`);
        const next = ROLE_HOME[pageRole] || "index.html";
        window.setTimeout(() => {
            window.location.href = next;
        }, 600);
    });
}
bootstrap();
