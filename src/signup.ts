import {
  DEMO_USERS,
  setActiveUser,
  Profile,
  UserRole,
  addUserTransaction,
  addUserNotification,
  saveRegisteredUser,
} from "./data/profileData.js";
import { addUser } from "./data/systemStore.js";
import { syncNavigation } from "./components/navigation.js";
import type { CoinTransaction } from "./types.js";

const ROLE_REDIRECT: Record<string, string> = {
  member: "index.html",
  donor: "requests.html",
  moderator: "moderation.html",
  admin: "admin.html",
};

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function bootstrap(): void {
  syncNavigation();

  // 1-Click Demo Login
  const demoButtons = document.querySelectorAll<HTMLButtonElement>("[data-demo-role]");
  demoButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const roleKey = btn.dataset.demoRole;
      if (!roleKey) return;
      const account = DEMO_USERS[roleKey];
      if (!account) return;

      btn.disabled = true;
      btn.textContent = `Signing in as ${account.name}...`;

      setActiveUser(account);

      const target = ROLE_REDIRECT[roleKey] || "index.html";
      window.location.href = target;
    });
  });

  // Custom User Registration
  const form = document.getElementById("signup-form") as HTMLFormElement | null;
  const alertBox = document.getElementById("signup-alert");

  function showAlert(message: string, isError = false): void {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `signup-alert ${isError ? "signup-alert--error" : "signup-alert--success"}`;
    alertBox.style.display = "block";
  }

  function hideAlert(): void {
    if (alertBox) alertBox.style.display = "none";
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      hideAlert();

      const nameInput = document.getElementById("signup-name") as HTMLInputElement | null;
      const emailInput = document.getElementById("signup-email") as HTMLInputElement | null;
      const passwordInput = document.getElementById("signup-password") as HTMLInputElement | null;
      const neighborhoodSelect = document.getElementById("signup-neighborhood") as HTMLSelectElement | null;
      const roleSelect = document.getElementById("signup-role") as HTMLSelectElement | null;
      const submitBtn = document.getElementById("signup-submit-btn") as HTMLButtonElement | null;

      const name = nameInput?.value.trim() || "";
      const email = emailInput?.value.trim().toLowerCase() || "";
      const password = passwordInput?.value.trim() || "";
      const neighborhood = neighborhoodSelect?.value || "Downtown Villa";
      const role = (roleSelect?.value as UserRole) || "Community Member";

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

      const newProfile: Profile = {
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
        roleScope:
          role === "Item Donor / Provider"
            ? "Provide items for donation or exchange and update item availability."
            : "Post items, browse listings, request exchanges/donations, and manage your posts.",
      };

      // Add a welcome transaction to localStorage
      const now = new Date();
      const dateStr = `${now.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`;
      const welcomeTx: CoinTransaction = {
        id: `tx_${Date.now()}`,
        userId: newUserId,
        type: "earned",
        amount: 100,
        title: "Welcome grant: joined Villa-Reuse community",
        category: "Welcome Grant",
        date: dateStr,
      };
      addUserTransaction(newUserId, welcomeTx);

      // Add a welcome notification
      addUserNotification(newUserId, {
        title: "Welcome to Villa-Reuse!",
        message: "Your account is active with 100 free ReUse Coins. Start browsing or post an item today!",
        tag: "Welcome",
      });

      // Add user to system store so they appear in Admin User Management
      addUser({
        id: newUserId,
        name,
        email,
        role,
        neighborhood,
        status: "Active",
        itemsCount: 0,
        joinedYear: new Date().getFullYear(),
      });

      // Save to registered users registry for subsequent logins
      saveRegisteredUser(newProfile, password);

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
