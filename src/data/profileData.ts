export interface ActivityEntry {
  id: string;
  title: string;
  note: string;
  count?: number;
  icon: "leaf" | "heart" | "coin" | "bell";
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

export function logoutUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to remove user from localStorage", err);
  }
}

export const ACTIVITY: ActivityEntry[] = [
  { id: "donations",    title: "My donations",        note: "Items you've shared",       count: 3, icon: "leaf"  },
  { id: "claims",       title: "Claims & exchanges",  note: "Requests and pickup details", count: 2, icon: "leaf"  },
  { id: "favorites",    title: "Favorite items",      note: "Things you saved for later",  count: 2, icon: "heart" },
  { id: "transactions", title: "Transaction history", note: "Coins earned and spent",             icon: "coin" },
  { id: "notifications",title: "Notifications",       note: "Updates from the community", count: 5, icon: "bell"  },
];
