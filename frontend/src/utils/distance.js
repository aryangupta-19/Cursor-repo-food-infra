function toRadians(value) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(start, end) {
  if (
    !start ||
    !end ||
    typeof start.lat !== "number" ||
    typeof start.lng !== "number" ||
    typeof end.lat !== "number" ||
    typeof end.lng !== "number"
  ) {
    return null;
  }

  const earthRadiusKm = 6371;
  const dLat = toRadians(end.lat - start.lat);
  const dLng = toRadians(end.lng - start.lng);
  const lat1 = toRadians(start.lat);
  const lat2 = toRadians(end.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function getDeliveryTime(userLoc, foodLoc, userCoordinates, foodCoordinates) {
  const distanceKm = getDistanceKm(userCoordinates, foodCoordinates);

  if (distanceKm !== null) {
    const assumedCitySpeedKmPerHour = 22;
    return Math.max(Math.round((distanceKm / assumedCitySpeedKmPerHour) * 60), 10);
  }

  if (
    typeof userLoc === "string" &&
    typeof foodLoc === "string" &&
    userLoc.trim().toLowerCase() === foodLoc.trim().toLowerCase()
  ) {
    return 30;
  }

  if (typeof userLoc === "string" && userLoc.trim()) {
    return 120;
  }

  return undefined;
}

export function isDeliverable(expiry, deliveryTime) {
  const hours = parseInt(expiry);
  return deliveryTime <= hours * 60;
}
