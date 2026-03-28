export function getDeliveryTime(userLoc, foodLoc) {
  if (userLoc === foodLoc) return 30; // minutes
  return 120; // assume nearby city
}

export function isDeliverable(expiry, deliveryTime) {
  const hours = parseInt(expiry);
  return deliveryTime <= hours * 60;
}
