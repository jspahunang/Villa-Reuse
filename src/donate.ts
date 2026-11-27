import { mountPhotoUploader } from "./components/photoUploader.js";
import { mountConditionToggle } from "./components/conditionToggle.js";
import { estimateCoins } from "./components/coinEstimator.js";
import { addItem } from "./data/systemStore.js";
import { setActiveUser, addUserTransaction, addUserNotification } from "./data/profileData.js";
import { syncNavigation } from "./components/navigation.js";
import { mountLogout } from "./components/auth.js";
import type { Item, Category, ListingType, ItemCondition, CoinTransaction } from "./types.js";

function requireElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

function bootstrap(): void {
  const activeUser = syncNavigation();
  mountLogout();


  const form = requireElement<HTMLFormElement>("donate-form");
  const zone = requireElement<HTMLElement>("upload-zone");
  const photoInput = requireElement<HTMLInputElement>("photo-input");
  const preview = requireElement<HTMLImageElement>("photo-preview");
  const uploadLabel = requireElement<HTMLElement>("upload-label");
  const conditionGroup = requireElement<HTMLElement>("condition-group");
  const category = requireElement<HTMLSelectElement>("category");
  const nameInput = requireElement<HTMLInputElement>("item-name");
  const story = requireElement<HTMLTextAreaElement>("story");
  const coinAmount = requireElement<HTMLElement>("coin-amount");
  const earnAmount = requireElement<HTMLElement>("earn-amount");

  const typeDonationBtn = requireElement<HTMLButtonElement>("type-donation-btn");
  const typeExchangeBtn = requireElement<HTMLButtonElement>("type-exchange-btn");
  const exchangeFieldGroup = requireElement<HTMLElement>("exchange-field-group");
  const exchangeWishInput = requireElement<HTMLInputElement>("exchange-wish");

  let currentType: ListingType = "Donation";

  typeDonationBtn.addEventListener("click", () => {
    currentType = "Donation";
    typeDonationBtn.classList.add("segmented__option--active");
    typeExchangeBtn.classList.remove("segmented__option--active");
    exchangeFieldGroup.style.display = "none";
  });

  typeExchangeBtn.addEventListener("click", () => {
    currentType = "Exchange";
    typeExchangeBtn.classList.add("segmented__option--active");
    typeDonationBtn.classList.remove("segmented__option--active");
    exchangeFieldGroup.style.display = "block";
    exchangeWishInput.focus();
  });

  const uploader = mountPhotoUploader(zone, photoInput, preview, uploadLabel, (msg) => {
    alert(msg);
  });

  // Sample photo presets
  document.querySelectorAll<HTMLButtonElement>("#donate-photo-presets [data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = btn.dataset.preset;
      if (preset) {
        uploader.setDataUrl(preset, `Sample: ${btn.textContent?.trim() || preset}`);
      }
    });
  });

  // Custom photo URL
  const customUrlInput = document.getElementById("donate-photo-url") as HTMLInputElement | null;
  const applyUrlBtn = document.getElementById("donate-apply-url-btn") as HTMLButtonElement | null;
  if (customUrlInput && applyUrlBtn) {
    applyUrlBtn.addEventListener("click", () => {
      const val = customUrlInput.value.trim();
      if (!val) {
        customUrlInput.focus();
        return;
      }
      uploader.setDataUrl(val, "Custom Image URL");
    });
  }

  function refreshCoins(): void {
    const value = estimateCoins(category.value, getCondition());
    const text = String(value);
    coinAmount.textContent = text;
    earnAmount.textContent = text;
  }

  const getCondition = mountConditionToggle(conditionGroup, refreshCoins);
  category.addEventListener("change", refreshCoins);

  requireElement<HTMLButtonElement>("cancel-btn").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = nameInput.value.trim();
    if (!title) {
      nameInput.focus();
      alert("Please enter an item name.");
      return;
    }

    if (currentType === "Exchange" && !exchangeWishInput.value.trim()) {
      exchangeWishInput.focus();
      alert("Please specify what you would like in exchange.");
      return;
    }

    const earnedCoins = Number(coinAmount.textContent) || 20;

    // Pick image: uploaded image or fallback asset based on category
    let itemImage = "assets/denim-jacket.png";
    const uploadedDataUrl = uploader.getDataUrl();
    if (uploadedDataUrl) {
      itemImage = uploadedDataUrl;
    } else if (preview.src && !preview.hidden) {
      itemImage = preview.src;
    } else {
      if (category.value === "Appliances") itemImage = "assets/electric-kettle.png";
      else if (category.value === "Books" || category.value === "School Supplies") itemImage = "assets/design-handbook.png";
      else if (category.value === "Household Items" || category.value === "Furniture") itemImage = "assets/ceramic-table-set.png";
    }

    const newItem: Item = {
      id: `item_${Date.now()}`,
      title,
      description: story.value.trim() || `Pre-loved ${title} available from ${activeUser.name}.`,
      category: category.value as Category,
      condition: getCondition() as ItemCondition,
      listingType: currentType,
      exchangeFor: currentType === "Exchange" ? exchangeWishInput.value.trim() : undefined,
      status: "Available",
      donorId: activeUser.id || "usr_member",
      donorName: activeUser.name,
      distanceKm: 0.5,
      postedAgo: "Just now",
      coins: earnedCoins,
      image: itemImage,
      details: `${getCondition()} condition · ${category.value}`,
    };

    addItem(newItem);

    // Update active user's coins & shared count
    activeUser.coins += earnedCoins;
    activeUser.itemsShared += 1;
    setActiveUser(activeUser);

    // Record coin transaction in ledger
    const now = new Date();
    const dateStr = `${now.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`;
    const tx: CoinTransaction = {
      id: `tx_${Date.now()}`,
      userId: activeUser.id,
      type: "earned",
      amount: earnedCoins,
      title: `Listed "${title}" (${currentType})`,
      category: "Item Listing",
      date: dateStr,
    };
    addUserTransaction(activeUser.id, tx);

    // Send item published notification
    addUserNotification(activeUser.id, {
      title: `Listing published: ${title}`,
      message: `Your ${currentType.toLowerCase()} is now visible to the community. +${earnedCoins} ReUse Coins credited!`,
      tag: "Item",
    });

    alert(`Success! "${title}" is now published as a ${currentType}. You earned ${earnedCoins} ReUse Coins!`);
    window.location.href = "index.html";
  });

  refreshCoins();
}

bootstrap();
