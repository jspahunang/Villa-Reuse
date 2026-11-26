import { DEMO_USERS, setActiveUser } from "./data/profileData.js";
import { syncNavigation } from "./components/navigation.js";
const ROLE_REDIRECT = {
    member: "index.html",
    donor: "requests.html",
    moderator: "moderation.html",
    admin: "admin.html",
};
function computeInitials(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0])
        return "U";
    if (parts.length === 1)
        return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function bootstrap() {
    syncNavigation();
    // 1-Click Demo Login
    const demoButtons = document.querySelectorAll("[data-demo-role]");
    demoButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const roleKey = btn.dataset.demoRole;
            if (!roleKey)
                return;
            const account = DEMO_USERS[roleKey];
            if (!account)
                return;
            btn.disabled = true;
            btn.textContent = `Signing in as ${account.name}...`;
            setActiveUser(account);
            const target = ROLE_REDIRECT[roleKey] || "index.html";
            window.location.href = target;
        });
    });
    // Custom User Registration
    const form = document.getElementById("signup-form");
    const alertBox = document.getElementById("signup-alert");
    function showAlert(message, isError = false) {
        if (!alertBox)
            return;
        alertBox.textContent = message;
        alertBox.className = `signup-alert ${isError ? "signup-alert--error" : "signup-alert--success"}`;
        alertBox.style.display = "block";
    }
    function hideAlert() {
        if (alertBox)
            alertBox.style.display = "none";
    }
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            hideAlert();
            const nameInput = document.getElementById("signup-name");
            const emailInput = document.getElementById("signup-email");
            const passwordInput = document.getElementById("signup-password");
            const neighborhoodSelect = document.getElementById("signup-neighborhood");
            const roleSelect = document.getElementById("signup-role");
            const submitBtn = document.getElementById("signup-submit-btn");
            const name = nameInput?.value.trim() || "";
            const email = emailInput?.value.trim().toLowerCase() || "";
            const password = passwordInput?.value.trim() || "";
            const neighborhood = neighborhoodSelect?.value || "Downtown Villa";
            const role = roleSelect?.value || "Community Member";
            if (!name) {
                showAlert("Please enter your full name.", true);
                nameInput?.focus();
                return;
            }
            if (!email || !email.includes("@")) {
                showAlert("Please enter a valid email address.", true);
                emailInput?.focus();
                return;
            }
            if (!password || password.length < 4) {
                showAlert("Please choose a password with at least 4 characters.", true);
                passwordInput?.focus();
                return;
            }
            const newUserId = `usr_${Date.now()}`;
            const initials = computeInitials(name);
            const newProfile = {
                id: newUserId,
                name,
                email,
                initials,
                neighborhood,
                memberSince: new Date().getFullYear(),
                coins: 100, // Welcome gift
                itemsShared: 0,
                wasteSavedKg: 0,
                role,
                roleScope: role === "Item Donor / Provider"
                    ? "Provide items for donation or exchange and update item availability."
                    : "Post items, browse listings, request exchanges/donations, and manage your posts.",
            };
            // Add a welcome transaction to localStorage
            const welcomeTx = [
                {
                    id: `tx_${Date.now()}`,
                    amount: 100,
                    description: "Welcome gift: joining Villa-Reuse community",
                    date: "Just now",
                    type: "earned",
                },
            ];
            try {
                localStorage.setItem(`villa_reuse_transactions_${newUserId}`, JSON.stringify(welcomeTx));
            }
            catch {
                // ignore
            }
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Setting up account...";
            }
            setActiveUser(newProfile);
            showAlert(`Welcome, ${name}! Your account has been created with 100 free ReUse Coins. Redirecting...`);
            window.setTimeout(() => {
                window.location.href = "index.html";
            }, 700);
        });
    }
}
bootstrap();
