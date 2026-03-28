import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";
import Alerts from "./Alerts";
import { getExpiryHoursValue, matchesFoodFilters } from "../services/api";
import { getDeliveryTime, isDeliverable } from "../utils/distance";
import { calculatePriority } from "../utils/priority";

function FoodList({ searchText = "", locationText = "", ngoRequest }) {
  const foods = useQuery(api.food.getFoods) || [];
  const userLocation = locationText;
  const filteredFoods = foods.filter((food) => {
    const deliveryTime = getDeliveryTime(userLocation, food.location);
    return isDeliverable(food.expiryTime, deliveryTime);
  });
  const availableFoods = filteredFoods.filter(
    (food) =>
      !food.claimedBy &&
      matchesFoodFilters(food, searchText, locationText),
  );
  const activeNgoRequest = ngoRequest ?? {
    location: locationText,
    quantity: 1,
  };
  const rankedFoods = availableFoods
    .map((food) => ({
      ...food,
      priorityScore: calculatePriority(food, activeNgoRequest),
    }))
    .filter((food) => food.priorityScore > 0)
    .sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div style={{ textAlign: "left" }}>
      <Alerts foods={rankedFoods} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <h2>Available Food</h2>
        <span style={{ color: "#6b7280" }}>
          {rankedFoods.length} visible listing{rankedFoods.length === 1 ? "" : "s"}
        </span>
      </div>

      {rankedFoods.length ? (
        rankedFoods.map((food) => (
          <div
            key={food._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{food.foodName}</h3>
            <p>Quantity: {food.quantity}</p>
            <p>Expiry in: {getExpiryHoursValue(food.expiryTime)} hrs</p>
            <p>
              Delivery time: {getDeliveryTime(activeNgoRequest.location, food.location)} mins
            </p>
            <p>Priority Score: {food.priorityScore.toFixed(2)}</p>
          </div>
        ))
      ) : (
        <div
          style={{
            border: "1px dashed #cbd5e1",
            borderRadius: "14px",
            padding: "20px",
            color: "#6b7280",
            background: "#f8fafc",
          }}
        >
          No food listings match this search yet.
        </div>
      )}
    </div>
  );
}

export default FoodList;
