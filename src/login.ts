import { DEMO_USERS, setActiveUser, getActiveUser } from "./data/profileData.js";
import { syncNavigation } from "./components/navigation.js";
import type { Profile } from "./data/profileData.js";

const DEMO_PASSWORD = "villa2026";

const ROLE_HOME: Record<string, string> = {
  member: "index.html",
  donor: "requests.html",
  moderator: "moderation.html",
  admin: "admin.html",
  "Community Member": "index.html",
  "Item Donor / Provider": "requests.html",
  "Community Moderator": "moderation.html",
  "System Administrator": "admin.html",
};

function getRoleFromUser(user: Profile): string {
  if (user.id === "usr_member" || user.email === "member@villareuse.org") return "member";
  if (user.id === "usr_donor" || user.email === "donor@villareuse.org") return "donor";
  if (user.id === "usr_moderator" || user.email === "moderator@villareuse.org") return "moderator";
  if (user.id === "usr_admin" || user.email === "admin@villareuse.org") return "admin";
  return ROLE_HOME[user.role] ? user.role : "member";
}

function openForgotPasswordModal(onFillPassword?: () => void): void {
  let overlay = document.getElementById("forgot-password-modal-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "forgot-password-modal-overlay";
    overlay.className = "modal-overlay";
    overlay.style.zIndex = "270";
    document.body.append(overlay);
  } else {
    overlay.style.zIndex = "270";
  }

  const close = () => {
    if (overlay) {
      overlay.classList.remove("modal-overlay--open");
      overlay.style.display = "none";
    }
  };

  overlay.innerHTML = `
    <div class="modal-dialog activity-dialog" style="max-width: 460px;" role="dialog" aria-modal="true" aria-labelledby="forgot-title">
      <button class="modal-close" type="button" aria-label="Close dialog">&times;</button>
      <div class="act-body">
        <div class="act-header">
          <div class="act-header__left">
            <span class="act-badge act-badge--green">Account Assistance</span>
            <h2 class="act-title" id="forgot-title">Forgot Your Password?</h2>
            <p class="act-subtitle">Villa-Reuse community demo accounts use a shared master password.</p>
          </div>
        </div>

        <div style="background:var(--c-bg); border:1px solid var(--c-border); border-radius:var(--radius-md); padding:16px; margin: 16px 0;">
          <p style="font-size:13px; color:var(--c-text); margin:0 0 8px; line-height:1.5;">
            For all standard demo users (Jordan Lee, Maria Santos, Alex Chen, Samira Patel), the password is:
          </p>
          <div style="background:#ffffff; border:1px solid var(--c-border); border-radius:6px; padding:10px 14px; text-align:center; font-family:monospace; font-size:16px; font-weight:700; color:var(--c-green-800); letter-spacing:0.05em;">
            villa2026
          </div>
          <p style="font-size:11px; color:var(--c-muted); margin:10px 0 0; line-height:1.4;">
            If you created a personal account, you can also sign in with the password you chose during registration or create a new account anytime.
          </p>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button class="btn btn--outline" type="button" id="close-forgot-modal">Close</button>
          <button class="btn btn--solid" type="button" id="fill-demo-pass-btn">Auto-Fill Password</button>
        </div>
      </div>
    </div>
  `;

  overlay.style.display = "flex";
  overlay.classList.add("modal-overlay--open");

  overlay.querySelector(".modal-close")?.addEventListener("click", close);
  document.getElementById("close-forgot-modal")?.addEventListener("click", close);
  document.getElementById("fill-demo-pass-btn")?.addEventListener("click", () => {
    close();
    onFillPassword?.();
  });
}

function bootstrap(): void {
  syncNavigation();

  const form = document.getElementById("login-form");
  if (!(form instanceof HTMLFormElement)) return;

  const emailInput = document.getElementById("login-email") as HTMLInputElement | null;
  const passwordInput = document.getElementById("login-password") as HTMLInputElement | null;
  const togglePassBtn = document.getElementById("toggle-password") as HTMLButtonElement | null;
  const submitBtn = document.getElementById("submit-login-btn") as HTMLButtonElement | null;
  const alertBox = document.getElementById("login-alert");
  const forgotLink = document.getElementById("forgot-password-link");

  if (!emailInput || !passwordInput || !submitBtn || !alertBox) {
    return;
  }

  function showAlert(message: string, isError = false): void {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `login-alert ${isError ? "login-alert--error" : "login-alert--success"}`;
    alertBox.style.display = "block";
  }

  function hideAlert(): void {
    if (alertBox) alertBox.style.display = "none";
  }

  // Toggle password visibility
  if (togglePassBtn) {
    togglePassBtn.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      togglePassBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
  }

  // Forgot password click
  if (forgotLink) {
    forgotLink.addEventListener("click", () => {
      openForgotPasswordModal(() => {
        passwordInput.value = DEMO_PASSWORD;
        passwordInput.focus();
        showAlert("Demo password 'villa2026' filled. Enter your email or click a Demo User below to sign in.");
      });
    });
  }

  // Demo user quick-fill pills
  const demoButtons = document.querySelectorAll<HTMLButtonElement>("[data-demo-role]");
  demoButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      hideAlert();
      const roleKey = btn.dataset.demoRole;
      if (!roleKey) return;
      const account: Profile | undefined = DEMO_USERS[roleKey];
      if (!account) return;

      // Update inputs
      emailInput.value = account.email;
      passwordInput.value = DEMO_PASSWORD;

      // Update active styling
      demoButtons.forEach((b) => b.classList.remove("demo-user-pill--active"));
      btn.classList.add("demo-user-pill--active");

      // Give focus to submit button or email
      showAlert(`Selected ${account.name} (${account.role}). Ready to sign in!`);
    });
  });

  // Support single-role legacy page if data-page-role exists
  const pageRole = document.body.dataset.pageRole;
  if (pageRole && DEMO_USERS[pageRole]) {
    const defaultAccount = DEMO_USERS[pageRole];
    emailInput.value = defaultAccount.email;
    passwordInput.value = DEMO_PASSWORD;
  }

  // Form submit handler
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hideAlert();

    const email = emailInput.value.trim().toLowerCase();
    const pass = passwordInput.value.trim();

    if (!email) {
      showAlert("Please enter your email address.", true);
      emailInput.focus();
      return;
    }

    if (!pass) {
      showAlert("Please enter your password.", true);
      passwordInput.focus();
      return;
    }

    // Match user by email
    let matchedUser: Profile | undefined;

    // 1. Check in DEMO_USERS
    for (const key of Object.keys(DEMO_USERS)) {
      if (DEMO_USERS[key].email.toLowerCase() === email) {
        matchedUser = DEMO_USERS[key];
        break;
      }
    }

    // 2. Check active user or saved user if not in DEMO_USERS
    if (!matchedUser) {
      const active = getActiveUser();
      if (active.email.toLowerCase() === email) {
        matchedUser = active;
      }
    }

    // 3. Fallback for custom registered user matching
    if (!matchedUser) {
      // Check if user entered an email with villa-reuse domain or custom email
      // Allow signing in if pass is villa2026 or valid string
      showAlert("Account not found with this email. Please check your email or select a Demo User below.", true);
      emailInput.focus();
      return;
    }

    // Validate password: demo password or matching
    if (pass !== DEMO_PASSWORD) {
      showAlert("That password does not match this account. For demo access, use: villa2026", true);
      passwordInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in...";
    setActiveUser(matchedUser);
    showAlert(`Welcome back, ${matchedUser.name}! Opening your dashboard...`);

    const roleKey = getRoleFromUser(matchedUser);
    const destination = ROLE_HOME[roleKey] || "index.html";

    window.setTimeout(() => {
      window.location.href = destination;
    }, 500);
  });
}

bootstrap();
