import { api } from "../convex/api";

export { api };

export function normalizeText(value) {
  return value.trim().toLowerCase();
}

export function getExpiryHoursValue(expiryTime) {
  if (typeof expiryTime === "number") {
    return expiryTime;
  }

  const match = String(expiryTime).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function formatExpiryHours(expiryTime) {
  const hours = getExpiryHoursValue(expiryTime);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}

export function getExpiryDeadline(food) {
  return food.createdAt + getExpiryHoursValue(food.expiryTime) * 60 * 60 * 1000;
}

export function getRemainingExpiryMs(food, now = Date.now()) {
  const cycleMs = getExpiryHoursValue(food.expiryTime) * 60 * 60 * 1000;

  if (cycleMs <= 0) {
    return 0;
  }

  const elapsedMs = Math.max(now - food.createdAt, 0);
  const elapsedInCycle = elapsedMs % cycleMs;

  if (elapsedInCycle === 0) {
    return cycleMs;
  }

  return cycleMs - elapsedInCycle;
}

export function isFoodExpired(food, now = Date.now()) {
  return getRemainingExpiryMs(food, now) <= 0;
}

export function formatRemainingTime(remainingMs) {
  const totalSeconds = Math.max(Math.floor(remainingMs / 1000), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function getNumericQuantity(quantity) {
  return getQuantityKgValue(quantity);
}

export function getQuantityKgValue(quantity) {
  if (typeof quantity === "number") {
    return quantity > 0 ? quantity : 1;
  }

  const match = String(quantity).match(/(\d+(\.\d+)?)/);
  const amount = match ? Number(match[0]) : 1;
  return amount > 0 ? amount : 1;
}

export function formatQuantityKg(quantity) {
  const amount = getQuantityKgValue(quantity);
  const formatted = Number.isInteger(amount) ? String(amount) : amount.toFixed(1);
  return `${formatted} kg`;
}

export function getUrgencyLevel(expiryTime) {
  const hours = getExpiryHoursValue(expiryTime);

  if (hours <= 2) return "high";
  if (hours <= 6) return "medium";

  return "low";
}

export function getSuggestedAction(food, isNearby) {
  const urgency = getUrgencyLevel(food.expiryTime);

  if (urgency === "high" && isNearby) {
    return "Dispatch a nearby volunteer immediately.";
  }

  if (urgency === "high") {
    return "Share this with the nearest pantry or community fridge now.";
  }

  if (urgency === "medium") {
    return "Bundle this pickup with another nearby route in the next few hours.";
  }

  return "Keep visible to local groups and schedule a planned pickup.";
}

export function getEstimatedPeopleServed(quantity) {
  const amount = getNumericQuantity(quantity);

  if (amount <= 5) return 5;
  if (amount <= 15) return 12;
  if (amount <= 30) return 25;
  if (amount <= 60) return 45;

  return 80;
}

export function matchesFoodFilters(food, searchText, locationText) {
  const normalizedSearch = normalizeText(searchText);
  const normalizedLocation = normalizeText(locationText);
  const foodName = normalizeText(food.foodName);
  const foodLocation = normalizeText(food.location);
  const urgency = getUrgencyLevel(food.expiryTime);

  const matchesSearch =
    !normalizedSearch ||
    foodName.includes(normalizedSearch) ||
    foodLocation.includes(normalizedSearch) ||
    (normalizedSearch.includes("urgent") && urgency === "high");

  const matchesLocation =
    !normalizedLocation || foodLocation.includes(normalizedLocation);

  return matchesSearch && matchesLocation;
}
