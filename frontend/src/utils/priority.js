import { getDeliveryTime } from "./distance";
import { getExpiryHoursValue, getNumericQuantity } from "../services/api";

export function calculatePriority(food, ngoRequest) {
  const deliveryTime = getDeliveryTime(ngoRequest.location, food.location);
  const expiryMins = getExpiryHoursValue(food.expiryTime) * 60;
  const foodQuantity = getNumericQuantity(food.quantity);
  const requestedQuantity = Math.max(ngoRequest.quantity, 1);
  const quantityMatch =
    Math.min(foodQuantity, requestedQuantity) / requestedQuantity;

  if (deliveryTime > expiryMins) return 0;

  const urgency = (expiryMins - deliveryTime) / expiryMins;
  const score = urgency * quantityMatch;

  return Number(score.toFixed(3));
}
