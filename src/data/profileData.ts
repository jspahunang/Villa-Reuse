import type { CoinTransaction, UserNotification, Item } from "../types.js";
import { getItems, getRequests, getReports, getAuditLogs } from "./systemStore.js";

export type { CoinTransaction, UserNotification };

export interface ActivityEntry {
  id: string;
  title: string;
  note: string;
  count?: number;
  icon: "leaf" | "heart" | "coin" | "bell" | "shield" | "clipboard";
}

export type UserRole =
  | "Community Member"
  | "Item Donor / Provider"
  | "Community Moderator"
  | "System Administrator";

export interface Profile {
  id: string;
  name: string;
  email: string;
  initials: string;
  neighborhood: string;
  memberSince: number;
  coins: number;
  itemsShared: number;
  wasteSavedKg: number;
  role: UserRole;
  roleScope: string;
  avatar?: string;
}

export const DEMO_USERS: Record<string, Profile> = {
  member: {
    id: "usr_member",
    name: "Jordan Lee",
    email: "member@villareuse.org",
    initials: "JL",
    neighborhood: "Downtown Villa",
    memberSince: 2023,
    coins: 120,
    itemsShared: 9,
    wasteSavedKg: 120,
    role: "Community Member",
    roleScope: "Post items, browse listings, request exchanges/donations, and manage your posts.",
  },
  donor: {
    id: "usr_donor",
    name: "Maria Santos",
    email: "donor@villareuse.org",
    initials: "MS",
    neighborhood: "Villa Verde East",
    memberSince: 2022,
    coins: 340,
    itemsShared: 24,
    wasteSavedKg: 285,
    role: "Item Donor / Provider",
    roleScope: "Provide items for donation or exchange and update item availability.",
  },
  moderator: {
    id: "usr_moderator",
    name: "Alex Chen",
    email: "moderator@villareuse.org",
    initials: "AC",
    neighborhood: "Oakridge District",
    memberSince: 2021,
    coins: 450,
    itemsShared: 18,
    wasteSavedKg: 190,
    role: "Community Moderator",
    roleScope: "Review reported listings, manage inappropriate posts, and ensure reliable data.",
  },
  admin: {
    id: "usr_admin",
    name: "Samira Patel",
    email: "admin@villareuse.org",
    initials: "SP",
    neighborhood: "Villa Central HQ",
    memberSince: 2020,
    coins: 999,
    itemsShared: 42,
    wasteSavedKg: 520,
    role: "System Administrator",
    roleScope: "Manage users, system records, permissions, and system audit logs.",
  },
};

export const PROFILE: Profile = DEMO_USERS.member;

export const STORAGE_KEY = "villa_reuse_active_user";
const FAVORITES_KEY_PREFIX = "villa_reuse_favorites_";
const TRANSACTIONS_KEY_PREFIX = "villa_reuse_transactions_";
const NOTIFICATIONS_KEY_PREFIX = "villa_reuse_notifs_";

export function getActiveUser(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Profile;
    }
  } catch (err) {
    console.warn("Failed to load user from localStorage", err);
  }
  return PROFILE;
}

export function setActiveUser(user: Profile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn("Failed to save user to localStorage", err);
  }
}

export function updateUserProfile(updates: Partial<Profile>): Profile {
  const current = getActiveUser();
  const initials = updates.name
    ? updates.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : current.initials;

  const updated: Profile = {
    ...current,
    ...updates,
    initials,
  };
  setActiveUser(updated);

  // Also update DEMO_USERS in-memory if matches
  Object.keys(DEMO_USERS).forEach((key) => {
    if (DEMO_USERS[key].id === updated.id) {
      DEMO_USERS[key] = { ...DEMO_USERS[key], ...updated };
    }
  });

  return updated;
}

export function updateUserAvatar(avatarUrl: string): Profile {
  return updateUserProfile({ avatar: avatarUrl });
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to remove user from localStorage", err);
  }
}

// ----------------- FAVORITES STORAGE -----------------
const DEFAULT_FAVORITES: Record<string, string[]> = {
  usr_member: ["item_1", "item_4"],
  usr_donor: ["item_2", "item_5"],
  usr_moderator: ["item_3", "item_1"],
  usr_admin: ["item_4", "item_6"],
};

export function getUserFavoriteIds(userId: string): string[] {
  try {
    const raw = localStorage.getItem(`${FAVORITES_KEY_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw) as string[];
    }
  } catch (e) {
    console.warn("Failed to read user favorites", e);
  }
  return DEFAULT_FAVORITES[userId] || ["item_1", "item_3"];
}

export function saveUserFavoriteIds(userId: string, ids: string[]): void {
  try {
    localStorage.setItem(`${FAVORITES_KEY_PREFIX}${userId}`, JSON.stringify(ids));
  } catch (e) {
    console.warn("Failed to save favorites", e);
  }
}

export function toggleUserFavorite(userId: string, itemId: string): boolean {
  const current = getUserFavoriteIds(userId);
  const exists = current.includes(itemId);
  const updated = exists ? current.filter((id) => id !== itemId) : [...current, itemId];
  saveUserFavoriteIds(userId, updated);
  return !exists;
}

export function isItemFavorited(userId: string, itemId: string): boolean {
  return getUserFavoriteIds(userId).includes(itemId);
}

export function getUserFavoriteItems(userId: string): Item[] {
  const ids = getUserFavoriteIds(userId);
  const allItems = getItems();
  return ids
    .map((id) => allItems.find((item) => item.id === id))
    .filter((item): item is Item => item !== undefined && !item.hidden);
}

// ----------------- COIN TRANSACTIONS STORAGE -----------------
const DEFAULT_TRANSACTIONS: Record<string, CoinTransaction[]> = {
  usr_member: [
    {
      id: "tx_m1",
      userId: "usr_member",
      type: "earned",
      amount: 25,
      title: "Shared Graphing Calculator & Ruler Kit",
      category: "Donation Reward",
      date: "Nov 24, 2026, 2:30 PM",
    },
    {
      id: "tx_m2",
      userId: "usr_member",
      type: "spent",
      amount: 15,
      title: "Design Handbook claim deposit",
      category: "Item Request",
      date: "Nov 20, 2026, 2:00 PM",
    },
    {
      id: "tx_m3",
      userId: "usr_member",
      type: "earned",
      amount: 10,
      title: "Recycled textiles at community dropoff",
      category: "Eco Milestone",
      date: "Nov 18, 2026, 11:15 AM",
    },
    {
      id: "tx_m4",
      userId: "usr_member",
      type: "earned",
      amount: 100,
      title: "Welcome grant & account registration",
      category: "Welcome Bonus",
      date: "Nov 10, 2026, 9:00 AM",
    },
  ],
  usr_donor: [
    {
      id: "tx_d1",
      userId: "usr_donor",
      type: "earned",
      amount: 40,
      title: "Listed Wooden Study Desk Chair",
      category: "Item Post",
      date: "Nov 22, 2026, 4:00 PM",
    },
    {
      id: "tx_d2",
      userId: "usr_donor",
      type: "earned",
      amount: 30,
      title: "Exchange completed: Ceramic Table Set",
      category: "Exchange Bonus",
      date: "Nov 20, 2026, 1:15 PM",
    },
    {
      id: "tx_d3",
      userId: "usr_donor",
      type: "earned",
      amount: 20,
      title: "Donated Denim Jacket to community",
      category: "Donation Reward",
      date: "Nov 19, 2026, 10:30 AM",
    },
    {
      id: "tx_d4",
      userId: "usr_donor",
      type: "earned",
      amount: 250,
      title: "Top Contributor community milestone",
      category: "Milestone Reward",
      date: "Nov 12, 2026, 3:00 PM",
    },
  ],
  usr_moderator: [
    {
      id: "tx_mod1",
      userId: "usr_moderator",
      type: "earned",
      amount: 50,
      title: "Listing quality & safety audit verification",
      category: "Moderator Reward",
      date: "Nov 24, 2026, 10:15 AM",
    },
    {
      id: "tx_mod2",
      userId: "usr_moderator",
      type: "earned",
      amount: 100,
      title: "Monthly community stewardship allocation",
      category: "Volunteer Grant",
      date: "Nov 15, 2026, 9:00 AM",
    },
    {
      id: "tx_mod3",
      userId: "usr_moderator",
      type: "earned",
      amount: 300,
      title: "Annual community safety milestone bonus",
      category: "Annual Reward",
      date: "Oct 30, 2026, 12:00 PM",
    },
  ],
  usr_admin: [
    {
      id: "tx_adm1",
      userId: "usr_admin",
      type: "earned",
      amount: 100,
      title: "System administrator monthly governance allowance",
      category: "System Allowance",
      date: "Nov 20, 2026, 8:00 AM",
    },
    {
      id: "tx_adm2",
      userId: "usr_admin",
      type: "earned",
      amount: 200,
      title: "Platform 1,000kg waste diversion celebration dividend",
      category: "Platform Bonus",
      date: "Nov 1, 2026, 10:00 AM",
    },
    {
      id: "tx_adm3",
      userId: "usr_admin",
      type: "earned",
      amount: 699,
      title: "Villa-Reuse platform founding reserve allocation",
      category: "Founding Reserve",
      date: "Oct 15, 2026, 9:00 AM",
    },
  ],
};

export function getUserTransactions(userId: string): CoinTransaction[] {
  try {
    const raw = localStorage.getItem(`${TRANSACTIONS_KEY_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw) as CoinTransaction[];
    }
  } catch (e) {
    console.warn("Failed to read transactions", e);
  }
  return DEFAULT_TRANSACTIONS[userId] || DEFAULT_TRANSACTIONS.usr_member;
}

export function saveUserTransactions(userId: string, txs: CoinTransaction[]): void {
  try {
    localStorage.setItem(`${TRANSACTIONS_KEY_PREFIX}${userId}`, JSON.stringify(txs));
  } catch (e) {
    console.warn("Failed to save transactions", e);
  }
}

export function addUserTransaction(userId: string, tx: CoinTransaction): void {
  const txs = getUserTransactions(userId);
  txs.unshift(tx);
  saveUserTransactions(userId, txs);
}

// ----------------- NOTIFICATIONS STORAGE -----------------
const DEFAULT_NOTIFICATIONS: Record<string, UserNotification[]> = {
  usr_member: [
    {
      id: "notif_m1",
      userId: "usr_member",
      title: "Exchange proposal received",
      message: "Elena Rostova proposed a blender exchange for your Electric Kettle listing.",
      date: "Nov 24, 2026, 4:15 PM",
      read: false,
      tag: "Exchange",
    },
    {
      id: "notif_m2",
      userId: "usr_member",
      title: "Request accepted!",
      message: "Maria Santos approved your request for Design Handbook. Pickup ready.",
      date: "Nov 23, 2026, 2:30 PM",
      read: false,
      tag: "Claim",
    },
    {
      id: "notif_m3",
      userId: "usr_member",
      title: "+25 ReUse Coins credited",
      message: "Thank you for passing on your school supplies to students in need.",
      date: "Nov 21, 2026, 11:00 AM",
      read: true,
      tag: "Coins",
    },
    {
      id: "notif_m4",
      userId: "usr_member",
      title: "New items in Downtown Villa",
      message: "3 new household items and books were just posted in your neighborhood.",
      date: "Nov 20, 2026, 9:00 AM",
      read: true,
      tag: "Community",
    },
    {
      id: "notif_m5",
      userId: "usr_member",
      title: "Villa Eco-Swap Meet this Saturday",
      message: "Bring your reusable items to Villa Central Park for community swaps.",
      date: "Nov 18, 2026, 10:00 AM",
      read: true,
      tag: "Event",
    },
  ],
  usr_donor: [
    {
      id: "notif_d1",
      userId: "usr_donor",
      title: "Incoming exchange offer",
      message: "Jordan Lee offered a countertop blender for your Electric Kettle.",
      date: "Nov 24, 2026, 4:15 PM",
      read: false,
      tag: "Requests",
    },
    {
      id: "notif_d2",
      userId: "usr_donor",
      title: "Plant exchange proposal",
      message: "Elena Rostova offered 3 potted succulents for your Ceramic Table Set.",
      date: "Nov 23, 2026, 11:30 AM",
      read: false,
      tag: "Requests",
    },
    {
      id: "notif_d3",
      userId: "usr_donor",
      title: "Milestone: 285 kg waste saved!",
      message: "Your 24 shared items have made a huge environmental difference in Villa Verde.",
      date: "Nov 22, 2026, 1:00 PM",
      read: true,
      tag: "Impact",
    },
    {
      id: "notif_d4",
      userId: "usr_donor",
      title: "Listing is live",
      message: "Wooden Study Desk Chair was published and is visible to all neighbors.",
      date: "Nov 20, 2026, 3:45 PM",
      read: true,
      tag: "Item",
    },
  ],
  usr_moderator: [
    {
      id: "notif_mod1",
      userId: "usr_moderator",
      title: "1 listing report needs review",
      message: "Wooden Study Desk Chair was flagged for safety verification by Carlos Diaz.",
      date: "Nov 24, 2026, 1:20 PM",
      read: false,
      tag: "Moderation",
    },
    {
      id: "notif_mod2",
      userId: "usr_moderator",
      title: "Report #rep_2 resolved",
      message: "Denim Jacket listing verified and report closed successfully.",
      date: "Nov 22, 2026, 10:15 AM",
      read: true,
      tag: "Resolved",
    },
    {
      id: "notif_mod3",
      userId: "usr_moderator",
      title: "Guidelines updated",
      message: "Updated safety check recommendations for household electronics and furniture.",
      date: "Nov 19, 2026, 8:30 AM",
      read: true,
      tag: "Policy",
    },
  ],
  usr_admin: [
    {
      id: "notif_adm1",
      userId: "usr_admin",
      title: "System audit log updated",
      message: "5 new operational audit records verified and archived in immutable log.",
      date: "Nov 24, 2026, 5:00 PM",
      read: false,
      tag: "Audit",
    },
    {
      id: "notif_adm2",
      userId: "usr_admin",
      title: "Platform users healthy",
      message: "All 4 demo user roles (Member, Donor, Moderator, Admin) active and synchronized.",
      date: "Nov 24, 2026, 9:00 AM",
      read: true,
      tag: "System",
    },
    {
      id: "notif_adm3",
      userId: "usr_admin",
      title: "Platform milestone exceeded",
      message: "Villa-Reuse platform overall community diverted waste surpassed 1,115 kg!",
      date: "Nov 23, 2026, 4:00 PM",
      read: true,
      tag: "Milestone",
    },
  ],
};

export function getUserNotifications(userId: string): UserNotification[] {
  try {
    const raw = localStorage.getItem(`${NOTIFICATIONS_KEY_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw) as UserNotification[];
    }
  } catch (e) {
    console.warn("Failed to read notifications", e);
  }
  return DEFAULT_NOTIFICATIONS[userId] || DEFAULT_NOTIFICATIONS.usr_member;
}

export function saveUserNotifications(userId: string, notifs: UserNotification[]): void {
  try {
    localStorage.setItem(`${NOTIFICATIONS_KEY_PREFIX}${userId}`, JSON.stringify(notifs));
  } catch (e) {
    console.warn("Failed to save notifications", e);
  }
}

export function markNotificationRead(userId: string, notifId: string): void {
  const notifs = getUserNotifications(userId);
  const target = notifs.find((n) => n.id === notifId);
  if (target) {
    target.read = true;
    saveUserNotifications(userId, notifs);
  }
}

export function markAllNotificationsRead(userId: string): void {
  const notifs = getUserNotifications(userId);
  notifs.forEach((n) => (n.read = true));
  saveUserNotifications(userId, notifs);
}

export function deleteNotification(userId: string, notifId: string): void {
  const notifs = getUserNotifications(userId);
  const updated = notifs.filter((n) => n.id !== notifId);
  saveUserNotifications(userId, updated);
}

export function addUserNotification(
  userId: string,
  notif: { title: string; message: string; tag?: string; date?: string; read?: boolean }
): UserNotification {
  const notifs = getUserNotifications(userId);
  const now = new Date();
  const dateStr =
    notif.date ||
    `${now.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`;
  const newNotif: UserNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    title: notif.title,
    message: notif.message,
    date: dateStr,
    read: notif.read ?? false,
    tag: notif.tag || "General",
  };
  notifs.unshift(newNotif);
  saveUserNotifications(userId, notifs);
  return newNotif;
}

// ----------------- REGISTERED USERS REGISTRY -----------------
const REGISTERED_USERS_KEY = "villa_reuse_registered_users";

export interface RegisteredUserRecord {
  profile: Profile;
  password?: string;
}

export function getRegisteredUsers(): RegisteredUserRecord[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to read registered users", e);
  }
  return [];
}

export function saveRegisteredUser(profile: Profile, password?: string): void {
  try {
    const users = getRegisteredUsers();
    const existingIndex = users.findIndex(
      (u) => u.profile.email.toLowerCase() === profile.email.toLowerCase()
    );
    if (existingIndex !== -1) {
      users[existingIndex] = {
        profile,
        password: password || users[existingIndex].password,
      };
    } else {
      users.push({ profile, password });
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn("Failed to save registered user", e);
  }
}

// ----------------- DYNAMIC ACTIVITY BUILDER -----------------
export function getUserActivities(user?: Profile): ActivityEntry[] {
  const active = user || getActiveUser();

  // 1. My donations count (exact count of user's active posted listings)
  const allItems = getItems();
  const userItems = allItems.filter(
    (i) =>
      (i.donorId === active.id || i.donorName.toLowerCase() === active.name.toLowerCase()) &&
      !i.hidden
  );
  const donationCount = userItems.length;

  // 2. Claims & exchanges count (exact incoming claims + sent requests)
  const allRequests = getRequests();
  const incoming = allRequests.filter(
    (r) =>
      r.donorName.toLowerCase() === active.name.toLowerCase() ||
      r.donorId === active.id
  );
  const sent = allRequests.filter(
    (r) =>
      r.requesterName.toLowerCase() === active.name.toLowerCase() ||
      r.requesterId === active.id
  );
  const claimsCount = incoming.length + sent.length;

  // 3. Favorites count (exact count of valid, non-hidden saved items)
  const favItems = getUserFavoriteItems(active.id);
  const favCount = favItems.length;

  // 4. Transaction history count (exact count of ledger records)
  const txs = getUserTransactions(active.id);
  const txCount = txs.length;

  // 5. Notifications count (exact unread count if any, or total count)
  const notifs = getUserNotifications(active.id);
  const unreadNotifs = notifs.filter((n) => !n.read).length;

  const activities: ActivityEntry[] = [
    {
      id: "donations",
      title: "My donations",
      note: `${donationCount} active ${donationCount === 1 ? "item" : "items"} shared`,
      count: donationCount,
      icon: "leaf",
    },
    {
      id: "claims",
      title: "Claims & exchanges",
      note: `${incoming.length} incoming · ${sent.length} sent`,
      count: claimsCount,
      icon: "leaf",
    },
    {
      id: "favorites",
      title: "Favorite items",
      note: `${favCount} saved ${favCount === 1 ? "item" : "items"}`,
      count: favCount,
      icon: "heart",
    },
    {
      id: "transactions",
      title: "Transaction history",
      note: `${active.coins} Coins balance · ${txCount} records`,
      count: txCount,
      icon: "coin",
    },
    {
      id: "notifications",
      title: "Notifications",
      note: unreadNotifs > 0 ? `${unreadNotifs} unread (${notifs.length} total)` : `${notifs.length} total updates`,
      count: unreadNotifs > 0 ? unreadNotifs : notifs.length,
      icon: "bell",
    },
  ];

  if (active.role === "Community Moderator") {
    const openReports = getReports().filter((r) => r.status === "Open").length;
    activities.push({
      id: "moderation_reports",
      title: "Moderation tasks",
      note: `${openReports} open ${openReports === 1 ? "report" : "reports"} to review`,
      count: openReports,
      icon: "shield",
    });
  }

  if (active.role === "System Administrator") {
    const totalLogs = getAuditLogs().length;
    activities.push({
      id: "admin_audit",
      title: "Audit & governance",
      note: `${totalLogs} platform audit ${totalLogs === 1 ? "event" : "events"}`,
      count: totalLogs,
      icon: "clipboard",
    });
  }

  return activities;
}

export const ACTIVITY: ActivityEntry[] = getUserActivities();
