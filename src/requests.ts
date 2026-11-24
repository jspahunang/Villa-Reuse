import { getRequests, updateRequestStatus } from "./data/systemStore.js";
import { syncNavigation } from "./components/navigation.js";
import { mountLogout } from "./components/auth.js";

function escapeHtml(value: string): string {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function bootstrap(): void {
  const activeUser = syncNavigation();
  mountLogout();


  const tabIncoming = document.getElementById("tab-incoming") as HTMLButtonElement;
  const tabSent = document.getElementById("tab-sent") as HTMLButtonElement;
  const countIncoming = document.getElementById("count-incoming") as HTMLElement;
  const countSent = document.getElementById("count-sent") as HTMLElement;
  const listContainer = document.getElementById("requests-list") as HTMLElement;

  let currentTab: "incoming" | "sent" = "incoming";

  function render(): void {
    const allRequests = getRequests();

    // In demo, if activeUser is donor or admin, show all incoming; otherwise show requests for their items or all for easy testing
    const incoming = allRequests.filter(
      (r) => r.donorName === activeUser.name || activeUser.role === "Item Donor / Provider" || activeUser.role === "System Administrator"
    );

    const sent = allRequests.filter(
      (r) => r.requesterName === activeUser.name || activeUser.role === "Community Member"
    );

    countIncoming.textContent = String(incoming.length);
    countSent.textContent = String(sent.length);

    listContainer.replaceChildren();

    const displayList = currentTab === "incoming" ? incoming : sent;

    if (displayList.length === 0) {
      const empty = document.createElement("div");
      empty.className = "grid__empty-container";
      empty.innerHTML = `
        <p class="grid__empty">No ${currentTab === "incoming" ? "incoming requests received" : "sent requests on record"}.</p>
        <small style="color:var(--c-muted); display:block; margin-top:6px;">
          ${currentTab === "incoming" ? "Post more items to receive donation claims or exchange proposals." : "Browse available items on the Home page and submit a request!"}
        </small>
      `;
      listContainer.append(empty);
      return;
    }

    displayList.forEach((req) => {
      const card = document.createElement("article");
      card.className = "request-card";

      const statusBadge = `<span class="card__type-pill badge--req-${req.status.toLowerCase()}">${req.status}</span>`;
      const isIncoming = currentTab === "incoming";

      card.innerHTML = `
        <div class="request-card__main">
          <div class="request-card__header">
            <h3 class="request-card__title">${escapeHtml(req.itemTitle)}</h3>
            <span class="card__type-pill ${req.type.includes("Exchange") ? "badge--exchange" : "badge--donation"}">${escapeHtml(req.type)}</span>
            ${statusBadge}
          </div>

          <p class="request-card__meta">
            ${isIncoming ? `Requested by <strong>${escapeHtml(req.requesterName)}</strong>` : `Requested from <strong>${escapeHtml(req.donorName)}</strong>`} · <small>${escapeHtml(req.createdAt)}</small>
          </p>

          ${
            req.exchangeOffer
              ? `
            <div class="request-card__proposal">
              <strong>Exchange Item Offered:</strong> ${escapeHtml(req.exchangeOffer)}
            </div>
          `
              : ""
          }

          <p class="request-card__note">"${escapeHtml(req.note)}"</p>
          <p class="request-card__pickup"><strong>Pickup window:</strong> ${escapeHtml(req.pickupTime)}</p>
        </div>

        <div class="request-card__actions">
          ${
            isIncoming
              ? `
            ${
              req.status === "Pending"
                ? `
              <button class="btn--sm btn--success" data-action="accept" data-id="${req.id}">Accept Request</button>
              <button class="btn--sm btn--danger" data-action="reject" data-id="${req.id}">Decline</button>
            `
                : ""
            }
            ${
              req.status === "Accepted"
                ? `
              <button class="btn--sm btn--success" data-action="complete" data-id="${req.id}">Mark Completed</button>
            `
                : ""
            }
            ${
              req.status === "Completed"
                ? `
              <span style="font-size:11px; color:var(--c-green-700); font-weight:700;">Handoff Complete</span>
            `
                : ""
            }
            ${
              req.status === "Rejected"
                ? `
              <span style="font-size:11px; color:#9b1c1c; font-weight:700;">Declined</span>
            `
                : ""
            }
          `
              : `
            <span style="font-size:12px; color:var(--c-muted);">
              ${req.status === "Pending" ? "Awaiting provider response" : req.status === "Accepted" ? "Approved! Ready for pickup" : req.status === "Completed" ? "Exchange complete" : "Declined by provider"}
            </span>
          `
          }
        </div>
      `;

      // Bind actions for donor
      if (isIncoming) {
        const acceptBtn = card.querySelector<HTMLButtonElement>('[data-action="accept"]');
        const rejectBtn = card.querySelector<HTMLButtonElement>('[data-action="reject"]');
        const completeBtn = card.querySelector<HTMLButtonElement>('[data-action="complete"]');

        if (acceptBtn) {
          acceptBtn.addEventListener("click", () => {
            updateRequestStatus(req.id, "Accepted", activeUser.name);
            alert(`Request for "${req.itemTitle}" accepted! Item is now Reserved.`);
            render();
          });
        }

        if (rejectBtn) {
          rejectBtn.addEventListener("click", () => {
            if (confirm(`Decline request from ${req.requesterName}?`)) {
              updateRequestStatus(req.id, "Rejected", activeUser.name);
              render();
            }
          });
        }

        if (completeBtn) {
          completeBtn.addEventListener("click", () => {
            updateRequestStatus(req.id, "Completed", activeUser.name);
            alert(`Great work! Transfer for "${req.itemTitle}" marked Completed. ReUse impact recorded!`);
            render();
          });
        }
      }

      listContainer.append(card);
    });
  }

  tabIncoming.addEventListener("click", () => {
    currentTab = "incoming";
    tabIncoming.classList.add("tab-btn--active");
    tabSent.classList.remove("tab-btn--active");
    tabIncoming.setAttribute("aria-selected", "true");
    tabSent.setAttribute("aria-selected", "false");
    render();
  });

  tabSent.addEventListener("click", () => {
    currentTab = "sent";
    tabSent.classList.add("tab-btn--active");
    tabIncoming.classList.remove("tab-btn--active");
    tabSent.setAttribute("aria-selected", "true");
    tabIncoming.setAttribute("aria-selected", "false");
    render();
  });

  render();
}

bootstrap();
