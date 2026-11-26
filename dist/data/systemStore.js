const ITEMS_KEY = "villa_reuse_items_v3";
const REQUESTS_KEY = "villa_reuse_requests_v3";
const REPORTS_KEY = "villa_reuse_reports_v3";
const LOGS_KEY = "villa_reuse_logs_v3";
const USERS_KEY = "villa_reuse_users_v3";
export const DEFAULT_ITEMS = [
    {
        id: "item_1",
        title: "Denim Jacket",
        description: "Classic vintage denim jacket in excellent shape. Light wash, unisex size M. Warm and sturdy for everyday use.",
        category: "Clothes",
        condition: "Good",
        listingType: "Donation",
        status: "Available",
        donorId: "usr_donor",
        donorName: "Maria Santos",
        distanceKm: 1.2,
        postedAgo: "2 hours ago",
        coins: 20,
        image: "assets/denim-jacket.png",
        details: "Size M · 80% Good",
    },
    {
        id: "item_2",
        title: "Electric Kettle",
        description: "Stainless steel 1.7L rapid boil kettle with auto shut-off and clean filter. Fully working.",
        category: "Appliances",
        condition: "Good",
        listingType: "Exchange",
        exchangeFor: "Desk fan or blender",
        status: "Requested",
        donorId: "usr_member",
        donorName: "Jordan Lee",
        distanceKm: 0.8,
        postedAgo: "5 hours ago",
        coins: 45,
        image: "assets/electric-kettle.png",
        details: "Works Well · Rapid Boil",
    },
    {
        id: "item_3",
        title: "Design Handbook",
        description: "Comprehensive UI/UX and visual design reference book. Clean pages with no notes or highlights.",
        category: "Books",
        condition: "Like New",
        listingType: "Donation",
        status: "Available",
        donorId: "usr_donor",
        donorName: "Maria Santos",
        distanceKm: 2.1,
        postedAgo: "1 day ago",
        coins: 15,
        image: "assets/design-handbook.png",
        details: "Hardcover · Like New",
    },
    {
        id: "item_4",
        title: "Ceramic Table Set",
        description: "4-piece handcrafted ceramic dinner set. Includes 2 bowls, 2 plates, earth-tone glaze.",
        category: "Household Items",
        condition: "Good",
        listingType: "Exchange",
        exchangeFor: "Indoor planters or plant cuttings",
        status: "Reserved",
        donorId: "usr_donor",
        donorName: "Maria Santos",
        distanceKm: 3.4,
        postedAgo: "2 days ago",
        coins: 30,
        image: "assets/ceramic-table-set.png",
        details: "4-piece set · Earth Tone",
    },
    {
        id: "item_5",
        title: "Graphing Calculator & Ruler Set",
        description: "Scientific graphing calculator with high-contrast display plus complete geometry ruler set. Great for high school or college students.",
        category: "School Supplies",
        condition: "Like New",
        listingType: "Donation",
        status: "Available",
        donorId: "usr_member",
        donorName: "Jordan Lee",
        distanceKm: 1.5,
        postedAgo: "3 days ago",
        coins: 25,
        image: "assets/design-handbook.png",
        details: "Calculator + Ruler Kit",
    },
    {
        id: "item_6",
        title: "Wooden Study Desk Chair",
        description: "Solid birch wooden chair with ergonomic curved backrest. Perfect for student room or home office.",
        category: "Furniture",
        condition: "Fair",
        listingType: "Exchange",
        exchangeFor: "Desk organizer or bookshelf",
        status: "Available",
        donorId: "usr_donor",
        donorName: "Maria Santos",
        distanceKm: 2.8,
        postedAgo: "4 days ago",
        coins: 40,
        image: "assets/ceramic-table-set.png",
        details: "Solid Birch · Ergonomic",
    },
    {
        id: "item_7",
        title: "LED Desk Reading Lamp",
        description: "Adjustable warm/cool light lamp with USB charging base. Excellent for reading and evening desk study.",
        category: "Appliances",
        condition: "Like New",
        listingType: "Donation",
        status: "Available",
        donorId: "usr_moderator",
        donorName: "Alex Chen",
        distanceKm: 1.8,
        postedAgo: "2 days ago",
        coins: 20,
        image: "assets/electric-kettle.png",
        details: "Adjustable · 3 Light Modes",
    },
    {
        id: "item_8",
        title: "Solar Power Bank 20000mAh",
        description: "Rugged outdoor power bank with dual USB ports and solar recharge panel. Fully tested and working.",
        category: "Appliances",
        condition: "Good",
        listingType: "Exchange",
        exchangeFor: "Bicycle lock or helmet",
        status: "Available",
        donorId: "usr_moderator",
        donorName: "Alex Chen",
        distanceKm: 2.2,
        postedAgo: "3 days ago",
        coins: 35,
        image: "assets/electric-kettle.png",
        details: "20,000mAh · Dual USB",
    },
    {
        id: "item_9",
        title: "Ergonomic Mechanical Keyboard",
        description: "Compact wireless mechanical keyboard with quiet linear switches. Clean and comfortable for typing.",
        category: "Appliances",
        condition: "Like New",
        listingType: "Exchange",
        exchangeFor: "Laptop stand or ergonomic mouse",
        status: "Available",
        donorId: "usr_admin",
        donorName: "Samira Patel",
        distanceKm: 0.9,
        postedAgo: "1 day ago",
        coins: 50,
        image: "assets/design-handbook.png",
        details: "Wireless · Linear Switches",
    },
    {
        id: "item_10",
        title: "Stainless Steel Thermal Flask Set",
        description: "Double-walled vacuum insulated flask with 2 travel mugs. Keeps liquids hot for 12 hours.",
        category: "Household Items",
        condition: "Good",
        listingType: "Donation",
        status: "Available",
        donorId: "usr_admin",
        donorName: "Samira Patel",
        distanceKm: 1.1,
        postedAgo: "3 days ago",
        coins: 25,
        image: "assets/ceramic-table-set.png",
        details: "Insulated · Flask + 2 Cups",
    },
];
export const DEFAULT_REQUESTS = [
    {
        id: "req_1",
        itemId: "item_2",
        itemTitle: "Electric Kettle",
        requesterId: "usr_donor",
        requesterName: "Maria Santos",
        donorId: "usr_member",
        donorName: "Jordan Lee",
        type: "Exchange Proposal",
        exchangeOffer: "Offering a 2-speed countertop fruit blender in great condition.",
        note: "Hi Jordan! Would love to trade my blender for your electric kettle.",
        pickupTime: "Weekday evenings between 5 PM and 7 PM",
        status: "Pending",
        createdAt: "Nov 24, 2026, 4:15 PM",
    },
    {
        id: "req_2",
        itemId: "item_4",
        itemTitle: "Ceramic Table Set",
        requesterId: "usr_member",
        requesterName: "Jordan Lee",
        donorId: "usr_donor",
        donorName: "Maria Santos",
        type: "Exchange Proposal",
        exchangeOffer: "Offering 3 potted succulents with ceramic trays.",
        note: "Would love to trade for these gorgeous ceramic plates!",
        pickupTime: "Saturday morning at the community center",
        status: "Accepted",
        createdAt: "Nov 23, 2026, 11:30 AM",
    },
    {
        id: "req_3",
        itemId: "item_3",
        itemTitle: "Design Handbook",
        requesterId: "usr_member",
        requesterName: "Jordan Lee",
        donorId: "usr_donor",
        donorName: "Maria Santos",
        type: "Donation Request",
        note: "Starting my product design course this term and this handbook would be a lifesaver.",
        pickupTime: "Anytime tomorrow afternoon",
        status: "Completed",
        createdAt: "Nov 20, 2026, 2:00 PM",
    },
    {
        id: "req_4",
        itemId: "item_7",
        itemTitle: "LED Desk Reading Lamp",
        requesterId: "usr_member",
        requesterName: "Jordan Lee",
        donorId: "usr_moderator",
        donorName: "Alex Chen",
        type: "Donation Request",
        note: "Hi Alex! My study lamp just stopped working, this would be fantastic.",
        pickupTime: "Friday afternoon",
        status: "Pending",
        createdAt: "Nov 24, 2026, 1:00 PM",
    },
    {
        id: "req_5",
        itemId: "item_9",
        itemTitle: "Ergonomic Mechanical Keyboard",
        requesterId: "usr_donor",
        requesterName: "Maria Santos",
        donorId: "usr_admin",
        donorName: "Samira Patel",
        type: "Exchange Proposal",
        exchangeOffer: "Offering handmade wooden desk organizer box.",
        note: "Would love this ergonomic keyboard for my work desk!",
        pickupTime: "Sunday at 11 AM",
        status: "Accepted",
        createdAt: "Nov 22, 2026, 10:30 AM",
    },
];
export const DEFAULT_REPORTS = [
    {
        id: "rep_1",
        itemId: "item_6",
        itemTitle: "Wooden Study Desk Chair",
        reporterName: "Carlos Diaz",
        reason: "Damaged or unsafe item",
        details: "Left front leg appears slightly wobbly in the photo. Please ask donor to confirm safety.",
        status: "Open",
        createdAt: "Nov 24, 2026, 1:20 PM",
    },
    {
        id: "rep_2",
        itemId: "item_1",
        itemTitle: "Denim Jacket",
        reporterName: "Anon Community Resident",
        reason: "Misleading description",
        details: "Checked previous listing, believed it might be size S rather than M.",
        status: "Dismissed",
        createdAt: "Nov 22, 2026, 9:45 AM",
    },
];
export const DEFAULT_LOGS = [
    {
        id: "log_1",
        timestamp: "2026-11-24 16:15",
        actor: "Jordan Lee",
        role: "Community Member",
        action: "Exchange Request Submitted",
        details: "Submitted exchange proposal for item #item_2 (Electric Kettle)",
    },
    {
        id: "log_2",
        timestamp: "2026-11-24 13:20",
        actor: "Carlos Diaz",
        role: "Community Member",
        action: "Listing Reported",
        details: "Reported #item_6 (Wooden Study Desk Chair) for safety verification",
    },
    {
        id: "log_3",
        timestamp: "2026-11-23 14:00",
        actor: "Maria Santos",
        role: "Item Donor / Provider",
        action: "Request Accepted",
        details: "Accepted request #req_2 from Elena Rostova for #item_4",
    },
    {
        id: "log_4",
        timestamp: "2026-11-22 10:15",
        actor: "Alex Chen",
        role: "Community Moderator",
        action: "Report Reviewed & Dismissed",
        details: "Dismissed report #rep_2 on #item_1 after donor confirmed sizing tag",
    },
    {
        id: "log_5",
        timestamp: "2026-11-20 09:30",
        actor: "Samira Patel",
        role: "System Administrator",
        action: "System Audit Maintenance",
        details: "Verified waste diversion metrics and community ReUse Coin ledger",
    },
];
export const DEFAULT_USERS = [
    {
        id: "usr_member",
        name: "Jordan Lee",
        email: "member@villareuse.org",
        role: "Community Member",
        neighborhood: "Downtown Villa",
        status: "Active",
        itemsCount: 9,
        joinedYear: 2023,
    },
    {
        id: "usr_donor",
        name: "Maria Santos",
        email: "donor@villareuse.org",
        role: "Item Donor / Provider",
        neighborhood: "Villa Verde East",
        status: "Active",
        itemsCount: 24,
        joinedYear: 2022,
    },
    {
        id: "usr_moderator",
        name: "Alex Chen",
        email: "moderator@villareuse.org",
        role: "Community Moderator",
        neighborhood: "Oakridge District",
        status: "Active",
        itemsCount: 18,
        joinedYear: 2021,
    },
    {
        id: "usr_admin",
        name: "Samira Patel",
        email: "admin@villareuse.org",
        role: "System Administrator",
        neighborhood: "Villa Central HQ",
        status: "Active",
        itemsCount: 42,
        joinedYear: 2020,
    },
];
function readFromStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (raw)
            return JSON.parse(raw);
    }
    catch (e) {
        console.warn(`Failed to read ${key} from storage:`, e);
    }
    return fallback;
}
function writeToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    }
    catch (e) {
        console.warn(`Failed to write ${key} to storage:`, e);
    }
}
// ------------------- ITEMS -------------------
export function getItems() {
    return readFromStorage(ITEMS_KEY, DEFAULT_ITEMS);
}
export function saveItems(items) {
    writeToStorage(ITEMS_KEY, items);
}
export function addItem(item) {
    const items = getItems();
    items.unshift(item);
    saveItems(items);
    addAuditLog({
        actor: item.donorName,
        role: "Item Donor / Provider",
        action: "New Item Posted",
        details: `Posted "${item.title}" under ${item.category} (${item.listingType})`,
    });
}
export function updateItemStatus(itemId, status) {
    const items = getItems();
    const index = items.findIndex((i) => i.id === itemId);
    if (index !== -1) {
        items[index].status = status;
        saveItems(items);
    }
}
export function updateItem(itemId, updates) {
    const items = getItems();
    const index = items.findIndex((i) => i.id === itemId);
    if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        saveItems(items);
        // Also mutate in-memory DEFAULT_ITEMS fallback
        const defaultIndex = DEFAULT_ITEMS.findIndex((i) => i.id === itemId);
        if (defaultIndex !== -1) {
            DEFAULT_ITEMS[defaultIndex] = { ...DEFAULT_ITEMS[defaultIndex], ...updates };
        }
        addAuditLog({
            actor: items[index].donorName,
            role: "Item Donor / Provider",
            action: "Item Listing Updated",
            details: `Updated "${items[index].title}" details/picture`,
        });
    }
}
export function setItemHidden(itemId, hidden) {
    const items = getItems();
    const index = items.findIndex((i) => i.id === itemId);
    if (index !== -1) {
        items[index].hidden = hidden;
        saveItems(items);
    }
}
// ------------------- REQUESTS -------------------
export function getRequests() {
    return readFromStorage(REQUESTS_KEY, DEFAULT_REQUESTS);
}
export function saveRequests(requests) {
    writeToStorage(REQUESTS_KEY, requests);
}
export function createRequest(request) {
    const requests = getRequests();
    requests.unshift(request);
    saveRequests(requests);
    // Update item status to Requested
    updateItemStatus(request.itemId, "Requested");
    addAuditLog({
        actor: request.requesterName,
        role: "Community Member",
        action: `${request.type} Created`,
        details: `Requested "${request.itemTitle}" from ${request.donorName}`,
    });
}
export function updateRequestStatus(requestId, status, actorName = "Item Donor") {
    const requests = getRequests();
    const req = requests.find((r) => r.id === requestId);
    if (!req)
        return;
    req.status = status;
    saveRequests(requests);
    if (status === "Accepted") {
        updateItemStatus(req.itemId, "Reserved");
    }
    else if (status === "Rejected") {
        updateItemStatus(req.itemId, "Available");
    }
    else if (status === "Completed") {
        updateItemStatus(req.itemId, "Completed");
    }
    addAuditLog({
        actor: actorName,
        role: "Item Donor / Provider",
        action: `Request ${status}`,
        details: `Request for "${req.itemTitle}" marked as ${status}`,
    });
}
// ------------------- REPORTS -------------------
export function getReports() {
    return readFromStorage(REPORTS_KEY, DEFAULT_REPORTS);
}
export function saveReports(reports) {
    writeToStorage(REPORTS_KEY, reports);
}
export function submitReport(report) {
    const reports = getReports();
    reports.unshift(report);
    saveReports(reports);
    addAuditLog({
        actor: report.reporterName,
        role: "Community Member",
        action: "Listing Reported",
        details: `Reported "${report.itemTitle}" for: ${report.reason}`,
    });
}
export function resolveReport(reportId, status, moderatorName = "Alex Chen") {
    const reports = getReports();
    const rep = reports.find((r) => r.id === reportId);
    if (!rep)
        return;
    rep.status = status;
    saveReports(reports);
    if (status === "Listing Removed") {
        setItemHidden(rep.itemId, true);
    }
    addAuditLog({
        actor: moderatorName,
        role: "Community Moderator",
        action: `Report ${status}`,
        details: `Report on "${rep.itemTitle}" resolved as ${status}`,
    });
}
// ------------------- AUDIT LOGS -------------------
export function getAuditLogs() {
    return readFromStorage(LOGS_KEY, DEFAULT_LOGS);
}
export function addAuditLog(entry) {
    const logs = getAuditLogs();
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const log = {
        id: `log_${Date.now()}`,
        timestamp,
        ...entry,
    };
    logs.unshift(log);
    writeToStorage(LOGS_KEY, logs);
}
// ------------------- USERS -------------------
export function getUsers() {
    return readFromStorage(USERS_KEY, DEFAULT_USERS);
}
export function toggleUserStatus(userId, actorName = "Admin", actorId) {
    if (actorId && actorId === userId)
        return;
    const users = getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user || user.id === actorId)
        return;
    user.status = user.status === "Active" ? "Suspended" : "Active";
    writeToStorage(USERS_KEY, users);
    addAuditLog({
        actor: actorName,
        role: "System Administrator",
        action: `User ${user.status === "Active" ? "Reactivated" : "Suspended"}`,
        details: `${user.name} (${user.email}) status changed to ${user.status}`,
    });
}
