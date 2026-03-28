export function getDeliveryTime(userLoc, foodLoc) {
  if (
    typeof userLoc === "string" &&
    typeof foodLoc === "string" &&
    userLoc.trim().toLowerCase() === foodLoc.trim().toLowerCase()
  ) {
    return 30; // minutes
  }

  return 120; // assume nearby city
}

export function isDeliverable(expiry, deliveryTime) {
  const hours = parseInt(expiry);
  return deliveryTime <= hours * 60;
}
