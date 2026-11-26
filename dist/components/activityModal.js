import { getActiveUser, toggleUserFavorite, getUserTransactions, getUserNotifications, getUserFavoriteItems, markNotificationRead, markAllNotificationsRead, deleteNotification, } from "../data/profileData.js";
import { getItems, getRequests, getReports, getAuditLogs, updateItemStatus, setItemHidden, updateRequestStatus, } from "../data/systemStore.js";
import { openItemModal } from "./itemModal.js";
import { openEditPhotoModal } from "./editPhotoModal.js";
function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}
let activeOverlay = null;
let currentKeydownHandler = null;
export function closeActivityModal() {
    if (activeOverlay) {
        activeOverlay.classList.remove("modal-overlay--open");
        activeOverlay.style.display = "none";
    }
    if (currentKeydownHandler) {
        document.removeEventListener("keydown", currentKeydownHandler);
        currentKeydownHandler = null;
    }
}
export function openActivityModal(activityId, onUpdate) {
    const activeUser = getActiveUser();
    let overlay = document.getElementById("activity-modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "activity-modal-overlay";
        overlay.className = "modal-overlay";
        document.body.append(overlay);
    }
    activeOverlay = overlay;
    if (currentKeydownHandler) {
        document.removeEventListener("keydown", currentKeydownHandler);
    }
    currentKeydownHandler = (e) => {
        if (e.key === "Escape")
            closeActivityModal();
    };
    document.addEventListener("keydown", currentKeydownHandler);
    overlay.onclick = (e) => {
        if (e.target === overlay)
            closeActivityModal();
    };
    overlay.style.display = "flex";
    overlay.classList.add("modal-overlay--open");
    renderActivityContent(activityId, activeUser, onUpdate);
}
function renderActivityContent(activityId, user, onUpdate) {
    if (!activeOverlay)
        return;
    const dialog = document.createElement("div");
    dialog.className = "modal-dialog activity-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    let contentHtml = "";
    switch (activityId) {
        case "donations":
            contentHtml = buildDonationsHtml(user);
            break;
        case "claims":
            contentHtml = buildClaimsHtml(user);
            break;
        case "favorites":
            contentHtml = buildFavoritesHtml(user);
            break;
        case "transactions":
            contentHtml = buildTransactionsHtml(user, "all");
            break;
        case "notifications":
            contentHtml = buildNotificationsHtml(user);
            break;
        case "moderation_reports":
            contentHtml = buildModerationHtml();
            break;
        case "admin_audit":
            contentHtml = buildAdminAuditHtml();
            break;
        default:
            contentHtml = `
        <div class="act-header">
          <h2 class="act-title">Activity</h2>
          <p class="act-subtitle">Details for ${escapeHtml(activityId)}</p>
        </div>
      `;
    }
    dialog.innerHTML = `
    <button class="modal-close" type="button" aria-label="Close dialog">&times;</button>
    <div class="act-body" id="act-body-container">
      ${contentHtml}
    </div>
  `;
    activeOverlay.replaceChildren(dialog);
    dialog.querySelector(".modal-close")?.addEventListener("click", closeActivityModal);
    attachActivityListeners(activityId, user, onUpdate);
}
// ========================================================================
// 1. MY DONATIONS
// ========================================================================
function buildDonationsHtml(user) {
    const allItems = getItems();
    const userItems = allItems.filter((i) => (i.donorId === user.id || i.donorName.toLowerCase() === user.name.toLowerCase()) &&
        !i.hidden);
    return `
    <div class="act-header">
      <div class="act-header__left">
        <span class="act-badge act-badge--green">Shared Items · ${userItems.length} active</span>
        <h2 class="act-title">My Donations & Listings</h2>
        <p class="act-subtitle">Manage items you've posted for donation or community exchange.</p>
      </div>
      <a class="btn btn--solid btn--sm" href="donate.html" style="text-decoration:none;">+ Post New Item</a>
    </div>

    ${userItems.length === 0
        ? `
      <div class="act-empty">
        <div class="act-empty__icon">🌿</div>
        <h3 class="act-empty__title">No active listings posted yet</h3>
        <p class="act-empty__text">Share an item from your home to help neighbors, reduce waste, and earn ReUse Coins!</p>
        <a class="btn btn--solid" href="donate.html" style="margin-top:12px; text-decoration:none;">Post an Item Now</a>
      </div>
    `
        : `
      <div class="act-items-grid">
        ${userItems
            .map((item) => {
            const isExchange = item.listingType === "Exchange";
            const statusClass = `badge--status-${(item.status || "available").toLowerCase()}`;
            return `
            <article class="act-item-card" data-item-id="${item.id}">
              <div class="act-item-card__media">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" />
                <span class="card__status ${statusClass}">${escapeHtml(item.status)}</span>
              </div>
              <div class="act-item-card__info">
                <div class="act-item-card__top">
                  <span class="card__tag">${escapeHtml(item.category)}</span>
                  <span class="card__type-pill ${isExchange ? "badge--exchange" : "badge--donation"}">
                    ${isExchange ? "Exchange" : "Free Donation"}
                  </span>
                  <span class="act-item-card__coin">★ ${item.coins} Coins</span>
                </div>
                <h4 class="act-item-card__title">${escapeHtml(item.title)}</h4>
                <p class="act-item-card__desc">${escapeHtml(item.description || item.details || "")}</p>
                
                <div class="act-item-card__controls">
                  <div class="act-status-select-wrap">
                    <label for="status-${item.id}">Status:</label>
                    <select class="act-select" id="status-${item.id}" data-action="change-item-status" data-id="${item.id}">
                      <option value="Available" ${item.status === "Available" ? "selected" : ""}>Available</option>
                      <option value="Requested" ${item.status === "Requested" ? "selected" : ""}>Requested</option>
                      <option value="Reserved" ${item.status === "Reserved" ? "selected" : ""}>Reserved</option>
                      <option value="Completed" ${item.status === "Completed" ? "selected" : ""}>Completed</option>
                    </select>
                  </div>
                  <div class="act-item-card__btns">
                    <button class="btn btn--outline btn--xs" type="button" data-action="edit-item-photo" data-id="${item.id}">📷 Edit Picture</button>
                    <button class="btn btn--outline btn--xs" type="button" data-action="view-item-modal" data-id="${item.id}">View Card</button>
                    <button class="btn btn--danger btn--xs" type="button" data-action="delete-item" data-id="${item.id}">Remove</button>
                  </div>
                </div>
              </div>
            </article>
          `;
        })
            .join("")}
      </div>
    `}
  `;
}
// ========================================================================
// 2. CLAIMS & EXCHANGES
// ========================================================================
function buildClaimsHtml(user, activeTab) {
    const allRequests = getRequests();
    const incoming = allRequests.filter((r) => r.donorName.toLowerCase() === user.name.toLowerCase() ||
        r.donorId === user.id);
    const sent = allRequests.filter((r) => r.requesterName.toLowerCase() === user.name.toLowerCase() ||
        r.requesterId === user.id);
    const tab = activeTab || (incoming.length > 0 ? "incoming" : "sent");
    const displayList = tab === "incoming" ? incoming : sent;
    const totalCount = incoming.length + sent.length;
    return `
    <div class="act-header">
      <div class="act-header__left">
        <span class="act-badge act-badge--green">Exchanges & Transfers · ${totalCount} total</span>
        <h2 class="act-title">Claims & Exchanges</h2>
        <p class="act-subtitle">Track pickup coordination, donation claims, and trade proposals (${incoming.length} incoming, ${sent.length} sent).</p>
      </div>
      <a class="btn btn--outline btn--sm" href="requests.html" style="text-decoration:none;">Open Full Manager ↗</a>
    </div>

    <div class="act-tabs" role="tablist">
      <button class="act-tab ${tab === "incoming" ? "act-tab--active" : ""}" type="button" data-tab="incoming">
        Incoming Claims (${incoming.length})
      </button>
      <button class="act-tab ${tab === "sent" ? "act-tab--active" : ""}" type="button" data-tab="sent">
        Sent Requests (${sent.length})
      </button>
    </div>

    ${displayList.length === 0
        ? `
      <div class="act-empty">
        <div class="act-empty__icon">📦</div>
        <h3 class="act-empty__title">No ${tab === "incoming" ? "incoming claims" : "sent requests"} found</h3>
        <p class="act-empty__text">
          ${tab === "incoming"
            ? "When neighbors request your shared items, they will appear here for your review and approval."
            : "Browse items on the Home feed and request one to give it a loving second home!"}
        </p>
        <a class="btn btn--solid" href="index.html" style="margin-top:12px; text-decoration:none;">Browse Available Items</a>
      </div>
    `
        : `
      <div class="act-requests-list">
        ${displayList
            .map((req) => {
            const statusClass = `badge--req-${req.status.toLowerCase()}`;
            const isIncoming = tab === "incoming";
            return `
            <div class="act-req-card">
              <div class="act-req-card__head">
                <div>
                  <h4 class="act-req-card__title">${escapeHtml(req.itemTitle)}</h4>
                  <span class="card__type-pill ${req.type.includes("Exchange") ? "badge--exchange" : "badge--donation"}">
                    ${escapeHtml(req.type)}
                  </span>
                </div>
                <span class="card__type-pill ${statusClass}">${escapeHtml(req.status)}</span>
              </div>

              <p class="act-req-card__parties">
                ${isIncoming
                ? `From: <strong>${escapeHtml(req.requesterName)}</strong>`
                : `To Donor: <strong>${escapeHtml(req.donorName)}</strong>`}
                · <small>${escapeHtml(req.createdAt)}</small>
              </p>

              ${req.exchangeOffer
                ? `
                <div class="act-req-card__offer">
                  <strong>Trade Offer:</strong> ${escapeHtml(req.exchangeOffer)}
                </div>
              `
                : ""}

              <p class="act-req-card__note">"${escapeHtml(req.note)}"</p>
              <p class="act-req-card__pickup">🕒 <strong>Pickup window:</strong> ${escapeHtml(req.pickupTime)}</p>

              ${isIncoming && req.status === "Pending"
                ? `
                <div class="act-req-card__actions">
                  <button class="btn btn--solid btn--sm btn--success" type="button" data-action="accept-req" data-id="${req.id}">
                    Accept Proposal
                  </button>
                  <button class="btn btn--danger btn--sm" type="button" data-action="reject-req" data-id="${req.id}">
                    Decline
                  </button>
                </div>
              `
                : isIncoming && req.status === "Accepted"
                    ? `
                <div class="act-req-card__actions">
                  <button class="btn btn--solid btn--sm" type="button" data-action="complete-req" data-id="${req.id}">
                    Mark Handover Completed
                  </button>
                </div>
              `
                    : ""}
            </div>
          `;
        })
            .join("")}
      </div>
    `}
  `;
}
// ========================================================================
// 3. FAVORITE ITEMS
// ========================================================================
function buildFavoritesHtml(user) {
    const favItems = getUserFavoriteItems(user.id);
    return `
    <div class="act-header">
      <div class="act-header__left">
        <span class="act-badge act-badge--gold">Saved List · ${favItems.length} items</span>
        <h2 class="act-title">Favorite Items</h2>
        <p class="act-subtitle">Things you've bookmarked for later pickup or future exchange.</p>
      </div>
      <a class="btn btn--outline btn--sm" href="index.html" style="text-decoration:none;">Browse Feed ↗</a>
    </div>

    ${favItems.length === 0
        ? `
      <div class="act-empty">
        <div class="act-empty__icon">❤️</div>
        <h3 class="act-empty__title">No favorite items saved</h3>
        <p class="act-empty__text">When you browse items on Villa-Reuse, bookmark the ones you love to access them quickly here.</p>
        <a class="btn btn--solid" href="index.html" style="margin-top:12px; text-decoration:none;">Explore Items</a>
      </div>
    `
        : `
      <div class="act-items-grid">
        ${favItems
            .map((item) => {
            const isExchange = item.listingType === "Exchange";
            const statusClass = `badge--status-${(item.status || "available").toLowerCase()}`;
            return `
            <article class="act-item-card" data-item-id="${item.id}">
              <div class="act-item-card__media">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" />
                <span class="card__status ${statusClass}">${escapeHtml(item.status)}</span>
              </div>
              <div class="act-item-card__info">
                <div class="act-item-card__top">
                  <span class="card__tag">${escapeHtml(item.category)}</span>
                  <span class="card__type-pill ${isExchange ? "badge--exchange" : "badge--donation"}">
                    ${isExchange ? "Exchange" : "Donation"}
                  </span>
                  <span class="act-item-card__coin">★ ${item.coins} Coins</span>
                </div>
                <h4 class="act-item-card__title">${escapeHtml(item.title)}</h4>
                <p class="act-item-card__desc">${escapeHtml(item.details || `${item.condition} condition`)}</p>
                <small style="color:var(--c-muted); display:block; margin: 4px 0 10px;">By <strong>${escapeHtml(item.donorName)}</strong> · ${item.distanceKm} km away</small>
                
                <div class="act-item-card__btns" style="margin-top:auto;">
                  <button class="btn btn--solid btn--xs" type="button" data-action="view-item-modal" data-id="${item.id}">View & Request</button>
                  <button class="btn btn--outline btn--xs" type="button" data-action="remove-fav" data-id="${item.id}">Remove</button>
                </div>
              </div>
            </article>
          `;
        })
            .join("")}
      </div>
    `}
  `;
}
// ========================================================================
// 4. TRANSACTION HISTORY
// ========================================================================
function buildTransactionsHtml(user, filter = "all") {
    const allTxs = getUserTransactions(user.id);
    const earnedTxs = allTxs.filter((t) => t.type === "earned");
    const spentTxs = allTxs.filter((t) => t.type === "spent");
    const filteredTxs = filter === "all"
        ? allTxs
        : filter === "earned"
            ? earnedTxs
            : spentTxs;
    const totalEarned = earnedTxs.reduce((sum, t) => sum + t.amount, 0);
    const totalSpent = spentTxs.reduce((sum, t) => sum + t.amount, 0);
    return `
    <div class="act-header">
      <div class="act-header__left">
        <span class="act-badge act-badge--green">ReUse Ledger · ${allTxs.length} records</span>
        <h2 class="act-title">ReUse Coin History</h2>
        <p class="act-subtitle">Complete ledger of coins earned, spent, and milestone rewards (${allTxs.length} total).</p>
      </div>
    </div>

    <div class="act-wallet-banner">
      <div class="act-wallet-stat">
        <span class="act-wallet-stat__label">CURRENT BALANCE</span>
        <span class="act-wallet-stat__value">${user.coins} <small>Coins</small></span>
      </div>
      <div class="act-wallet-divider"></div>
      <div class="act-wallet-stat">
        <span class="act-wallet-stat__label">LIFETIME EARNED</span>
        <span class="act-wallet-stat__value act-wallet-stat__value--earned">+${totalEarned} <small>Coins</small></span>
      </div>
      <div class="act-wallet-divider"></div>
      <div class="act-wallet-stat">
        <span class="act-wallet-stat__label">LIFETIME SPENT</span>
        <span class="act-wallet-stat__value act-wallet-stat__value--spent">-${totalSpent} <small>Coins</small></span>
      </div>
    </div>

    <div class="act-tabs" role="tablist">
      <button class="act-tab ${filter === "all" ? "act-tab--active" : ""}" type="button" data-tx-filter="all">
        All Transactions (${allTxs.length})
      </button>
      <button class="act-tab ${filter === "earned" ? "act-tab--active" : ""}" type="button" data-tx-filter="earned">
        Coins Earned (+${earnedTxs.length})
      </button>
      <button class="act-tab ${filter === "spent" ? "act-tab--active" : ""}" type="button" data-tx-filter="spent">
        Coins Spent (-${spentTxs.length})
      </button>
    </div>

    <div class="act-tx-list">
      ${filteredTxs.length === 0
        ? `<p class="act-empty-inline">No transactions match this filter.</p>`
        : filteredTxs
            .map((tx) => {
            const isEarned = tx.type === "earned";
            return `
              <div class="act-tx-row">
                <span class="act-tx-badge ${isEarned ? "act-tx-badge--earned" : "act-tx-badge--spent"}">
                  ${isEarned ? `+${tx.amount}` : `-${tx.amount}`}
                </span>
                <div class="act-tx-main">
                  <div class="act-tx-top">
                    <span class="act-tx-title">${escapeHtml(tx.title)}</span>
                    <span class="card__tag">${escapeHtml(tx.category)}</span>
                  </div>
                  <span class="act-tx-date">${escapeHtml(tx.date)}</span>
                </div>
              </div>
            `;
        })
            .join("")}
    </div>

    <div class="act-tip-box">
      <strong>💡 How to earn more ReUse Coins:</strong>
      <span>Post unwanted usable goods, complete verified community handovers, or participate in local neighborhood cleanups!</span>
    </div>
  `;
}
// ========================================================================
// 5. NOTIFICATIONS
// ========================================================================
function buildNotificationsHtml(user, activeTab) {
    const notifs = getUserNotifications(user.id);
    const unreadList = notifs.filter((n) => !n.read);
    const tab = activeTab || (unreadList.length > 0 ? "unread" : "all");
    const displayList = tab === "unread" ? unreadList : notifs;
    return `
    <div class="act-header">
      <div class="act-header__left">
        <span class="act-badge act-badge--green">Inbox · ${unreadList.length} unread</span>
        <h2 class="act-title">Community Notifications</h2>
        <p class="act-subtitle">Updates on your listings, claims, coins, and neighborhood alerts (${notifs.length} total).</p>
      </div>
      ${unreadList.length > 0
        ? `<button class="btn btn--outline btn--sm" type="button" data-action="mark-all-read">Mark All as Read</button>`
        : ""}
    </div>

    <div class="act-tabs" role="tablist">
      <button class="act-tab ${tab === "unread" ? "act-tab--active" : ""}" type="button" data-notif-tab="unread">
        Unread (${unreadList.length})
      </button>
      <button class="act-tab ${tab === "all" ? "act-tab--active" : ""}" type="button" data-notif-tab="all">
        All Notifications (${notifs.length})
      </button>
    </div>

    ${displayList.length === 0
        ? `
      <div class="act-empty">
        <div class="act-empty__icon">🔔</div>
        <h3 class="act-empty__title">${tab === "unread" ? "All caught up on unread!" : "No notifications right now"}</h3>
        <p class="act-empty__text">
          ${tab === "unread"
            ? "You have reviewed all your active updates. Switch to the 'All Notifications' tab to view past history."
            : "Check back soon for new community updates and alerts."}
        </p>
      </div>
    `
        : `
      <div class="act-notif-list">
        ${displayList
            .map((n) => {
            return `
            <div class="act-notif-card ${!n.read ? "act-notif-card--unread" : ""}" data-notif-id="${n.id}">
              <div class="act-notif-card__status">
                ${!n.read ? `<span class="act-notif-dot" title="Unread"></span>` : ""}
              </div>
              <div class="act-notif-card__body">
                <div class="act-notif-card__top">
                  <h4 class="act-notif-card__title">${escapeHtml(n.title)}</h4>
                  ${n.tag ? `<span class="card__tag">${escapeHtml(n.tag)}</span>` : ""}
                  <span class="act-notif-card__date">${escapeHtml(n.date)}</span>
                </div>
                <p class="act-notif-card__msg">${escapeHtml(n.message)}</p>
                <div class="act-notif-card__actions">
                  ${!n.read
                ? `<button class="btn-link" type="button" data-action="mark-read" data-id="${n.id}">Mark as read</button> · `
                : ""}
                  <button class="btn-link btn-link--danger" type="button" data-action="delete-notif" data-id="${n.id}">Dismiss</button>
                </div>
              </div>
            </div>
          `;
        })
            .join("")}
      </div>
    `}
  `;
}
// ========================================================================
// 6. MODERATION TASKS (MODERATOR ONLY)
// ========================================================================
function buildModerationHtml() {
    const reports = getReports();
    const openReports = reports.filter((r) => r.status === "Open");
    return `
    <div class="act-header">
      <div class="act-header__left">
        <span class="act-badge act-badge--gold">Moderator Duty · ${openReports.length} open</span>
        <h2 class="act-title">Moderation Tasks</h2>
        <p class="act-subtitle">Listing reports, safety inspections, and community enforcement flags.</p>
      </div>
      <a class="btn btn--solid btn--sm" href="moderation.html" style="text-decoration:none;">Open Moderation Hub ↗</a>
    </div>

    <div class="act-wallet-banner">
      <div class="act-wallet-stat">
        <span class="act-wallet-stat__label">OPEN REPORTS</span>
        <span class="act-wallet-stat__value" style="color:#b23b2e;">${openReports.length}</span>
      </div>
      <div class="act-wallet-divider"></div>
      <div class="act-wallet-stat">
        <span class="act-wallet-stat__label">TOTAL REPORTS</span>
        <span class="act-wallet-stat__value">${reports.length}</span>
      </div>
    </div>

    <div class="act-requests-list">
      ${openReports.length === 0
        ? `<p class="act-empty-inline">✅ No reports pending review right now. Community feed is safe and compliant!</p>`
        : openReports
            .map((rep) => `
            <div class="act-req-card">
              <div class="act-req-card__head">
                <h4 class="act-req-card__title">${escapeHtml(rep.itemTitle)}</h4>
                <span class="card__status badge--status-requested">Open Review</span>
              </div>
              <p class="act-req-card__parties">Reported by <strong>${escapeHtml(rep.reporterName)}</strong> · <small>${escapeHtml(rep.createdAt)}</small></p>
              <div class="act-req-card__offer"><strong>Reason:</strong> ${escapeHtml(rep.reason)}</div>
              <p class="act-req-card__note">"${escapeHtml(rep.details)}"</p>
            </div>
          `)
            .join("")}
    </div>
  `;
}
// ========================================================================
// 7. SYSTEM AUDIT (ADMIN ONLY)
// ========================================================================
function buildAdminAuditHtml() {
    const logs = getAuditLogs();
    return `
    <div class="act-header">
      <div class="act-header__left">
        <span class="act-badge act-badge--green">System Administration · ${logs.length} events</span>
        <h2 class="act-title">Platform Audit & Governance</h2>
        <p class="act-subtitle">Complete activity audit trail and operational system logs.</p>
      </div>
      <a class="btn btn--solid btn--sm" href="admin.html" style="text-decoration:none;">Open Admin Portal ↗</a>
    </div>

    <div class="act-tx-list">
      ${logs
        .map((log) => `
        <div class="act-tx-row">
          <div class="act-tx-main">
            <div class="act-tx-top">
              <span class="act-tx-title"><strong>${escapeHtml(log.action)}</strong></span>
              <span class="card__tag">${escapeHtml(log.role)}</span>
            </div>
            <p style="margin: 4px 0 2px; font-size:12px; color:var(--c-text);">${escapeHtml(log.details)}</p>
            <span class="act-tx-date">Actor: ${escapeHtml(log.actor)} · ${escapeHtml(log.timestamp)}</span>
          </div>
        </div>
      `)
        .join("")}
    </div>
  `;
}
// ========================================================================
// EVENT HANDLERS
// ========================================================================
function attachActivityListeners(activityId, user, onUpdate) {
    const container = document.getElementById("act-body-container");
    if (!container)
        return;
    // View item in full itemModal
    container.querySelectorAll('[data-action="view-item-modal"]').forEach((btn) => {
        btn.onclick = () => {
            const itemId = btn.dataset.id;
            if (!itemId)
                return;
            const item = getItems().find((i) => i.id === itemId);
            if (item) {
                openItemModal(item, () => {
                    renderActivityContent(activityId, user, onUpdate);
                    if (onUpdate)
                        onUpdate();
                });
            }
        };
    });
    // Edit item photo
    container.querySelectorAll('[data-action="edit-item-photo"]').forEach((btn) => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const itemId = btn.dataset.id;
            if (!itemId)
                return;
            const item = getItems().find((i) => i.id === itemId);
            if (item) {
                openEditPhotoModal(item, (newUrl) => {
                    // Immediately update card in DOM as well as re-rendering:
                    const cardImg = container.querySelector(`article[data-item-id="${item.id}"] .act-item-card__media img`);
                    if (cardImg)
                        cardImg.src = newUrl;
                    renderActivityContent("donations", user, onUpdate);
                    if (onUpdate)
                        onUpdate();
                });
            }
        };
    });
    // Change item status in My Donations
    container.querySelectorAll('[data-action="change-item-status"]').forEach((sel) => {
        sel.onchange = () => {
            const itemId = sel.dataset.id;
            const newStatus = sel.value;
            if (itemId && newStatus) {
                updateItemStatus(itemId, newStatus);
                renderActivityContent("donations", user, onUpdate);
                if (onUpdate)
                    onUpdate();
            }
        };
    });
    // Delete item from My Donations
    container.querySelectorAll('[data-action="delete-item"]').forEach((btn) => {
        btn.onclick = () => {
            const itemId = btn.dataset.id;
            if (itemId && confirm("Are you sure you want to remove this item listing?")) {
                setItemHidden(itemId, true);
                renderActivityContent("donations", user, onUpdate);
                if (onUpdate)
                    onUpdate();
            }
        };
    });
    // Claims tabs
    container.querySelectorAll(".act-tab[data-tab]").forEach((btn) => {
        btn.onclick = () => {
            const tab = btn.dataset.tab;
            container.innerHTML = buildClaimsHtml(user, tab);
            attachActivityListeners("claims", user, onUpdate);
        };
    });
    // Accept request
    container.querySelectorAll('[data-action="accept-req"]').forEach((btn) => {
        btn.onclick = () => {
            const reqId = btn.dataset.id;
            if (reqId) {
                updateRequestStatus(reqId, "Accepted", user.name);
                container.innerHTML = buildClaimsHtml(user, "incoming");
                attachActivityListeners("claims", user, onUpdate);
                if (onUpdate)
                    onUpdate();
            }
        };
    });
    // Reject request
    container.querySelectorAll('[data-action="reject-req"]').forEach((btn) => {
        btn.onclick = () => {
            const reqId = btn.dataset.id;
            if (reqId) {
                updateRequestStatus(reqId, "Rejected", user.name);
                container.innerHTML = buildClaimsHtml(user, "incoming");
                attachActivityListeners("claims", user, onUpdate);
                if (onUpdate)
                    onUpdate();
            }
        };
    });
    // Complete request
    container.querySelectorAll('[data-action="complete-req"]').forEach((btn) => {
        btn.onclick = () => {
            const reqId = btn.dataset.id;
            if (reqId) {
                updateRequestStatus(reqId, "Completed", user.name);
                container.innerHTML = buildClaimsHtml(user, "incoming");
                attachActivityListeners("claims", user, onUpdate);
                if (onUpdate)
                    onUpdate();
            }
        };
    });
    // Remove favorite
    container.querySelectorAll('[data-action="remove-fav"]').forEach((btn) => {
        btn.onclick = () => {
            const itemId = btn.dataset.id;
            if (itemId) {
                toggleUserFavorite(user.id, itemId);
                renderActivityContent("favorites", user, onUpdate);
                if (onUpdate)
                    onUpdate();
            }
        };
    });
    // Transaction filter tabs
    container.querySelectorAll(".act-tab[data-tx-filter]").forEach((btn) => {
        btn.onclick = () => {
            const filter = btn.dataset.txFilter;
            container.innerHTML = buildTransactionsHtml(user, filter);
            attachActivityListeners("transactions", user, onUpdate);
        };
    });
    // Notification tabs (Unread vs All)
    container.querySelectorAll(".act-tab[data-notif-tab]").forEach((btn) => {
        btn.onclick = () => {
            const tab = btn.dataset.notifTab;
            container.innerHTML = buildNotificationsHtml(user, tab);
            attachActivityListeners("notifications", user, onUpdate);
        };
    });
    // Notifications: mark single as read
    container.querySelectorAll('[data-action="mark-read"]').forEach((btn) => {
        btn.onclick = () => {
            const notifId = btn.dataset.id;
            if (notifId) {
                markNotificationRead(user.id, notifId);
                renderActivityContent("notifications", user, onUpdate);
                if (onUpdate)
                    onUpdate();
            }
        };
    });
    // Notifications: mark all as read
    container.querySelector('[data-action="mark-all-read"]')?.addEventListener("click", () => {
        markAllNotificationsRead(user.id);
        renderActivityContent("notifications", user, onUpdate);
        if (onUpdate)
            onUpdate();
    });
    // Notifications: delete notification
    container.querySelectorAll('[data-action="delete-notif"]').forEach((btn) => {
        btn.onclick = () => {
            const notifId = btn.dataset.id;
            if (notifId) {
                deleteNotification(user.id, notifId);
                renderActivityContent("notifications", user, onUpdate);
                if (onUpdate)
                    onUpdate();
            }
        };
    });
}
