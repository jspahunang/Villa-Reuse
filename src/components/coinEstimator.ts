import type { Condition } from "./conditionToggle.js";

const BASE: Record<string, number> = {
  Clothing: 20,
  Clothes: 20,
  "School Supplies": 25,
  "Household Items": 30,
  Furniture: 50,
  Electronics: 45,
  Appliances: 40,
  "Kitchen Items": 35,
  Books: 15,
  Others: 25,
};

const CONDITION_FACTOR: Record<Condition, number> = {
  Fair: 0.7,
  Good: 1,
  "Like new": 1.3,
};

export function estimateCoins(category: string, condition: Condition): number {
  const base = BASE[category] ?? 20;
  return Math.round(base * CONDITION_FACTOR[condition]);
}
