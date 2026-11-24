import { mountPhotoUploader } from "./components/photoUploader.js";
import { mountConditionToggle } from "./components/conditionToggle.js";
import { estimateCoins } from "./components/coinEstimator.js";
import { addItem } from "./data/systemStore.js";
import { setActiveUser } from "./data/profileData.js";
import { syncNavigation } from "./components/navigation.js";
import { mountLogout } from "./components/auth.js";
function requireElement(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Missing element #${id}`);
    return el;
}
function bootstrap() {
    const activeUser = syncNavigation();
    mountLogout();
    const form = requireElement("donate-form");
    const zone = requireElement("upload-zone");
    const photoInput = requireElement("photo-input");
    const preview = requireElement("photo-preview");
    const uploadLabel = requireElement("upload-label");
    const conditionGroup = requireElement("condition-group");
    const category = requireElement("category");
    const nameInput = requireElement("item-name");
    const story = requireElement("story");
    const coinAmount = requireElement("coin-amount");
    const earnAmount = requireElement("earn-amount");
    const typeDonationBtn = requireElement("type-donation-btn");
    const typeExchangeBtn = requireElement("type-exchange-btn");
    const exchangeFieldGroup = requireElement("exchange-field-group");
    const exchangeWishInput = requireElement("exchange-wish");
    let currentType = "Donation";
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
    function refreshCoins() {
        const value = estimateCoins(category.value, getCondition());
        const text = String(value);
        coinAmount.textContent = text;
        earnAmount.textContent = text;
    }
    const getCondition = mountConditionToggle(conditionGroup, refreshCoins);
    category.addEventListener("change", refreshCoins);
    requireElement("cancel-btn").addEventListener("click", () => {
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
        const uploadedFile = uploader.getFile();
        if (uploadedFile) {
            itemImage = preview.src || "assets/denim-jacket.png";
        }
        else {
            if (category.value === "Appliances")
                itemImage = "assets/electric-kettle.png";
            else if (category.value === "Books" || category.value === "School Supplies")
                itemImage = "assets/design-handbook.png";
            else if (category.value === "Household Items" || category.value === "Furniture")
                itemImage = "assets/ceramic-table-set.png";
        }
        const newItem = {
            id: `item_${Date.now()}`,
            title,
            description: story.value.trim() || `Pre-loved ${title} available from ${activeUser.name}.`,
            category: category.value,
            condition: getCondition(),
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
        alert(`Success! "${title}" is now published as a ${currentType}. You earned ${earnedCoins} ReUse Coins!`);
        window.location.href = "index.html";
    });
    refreshCoins();
}
bootstrap();
