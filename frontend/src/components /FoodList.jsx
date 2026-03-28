import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";
import FoodCard from "./FoodCard";
import Alerts from "./Alerts";
import { matchesFoodFilters } from "../services/api";
import { getDeliveryTime, isDeliverable } from "../utils/distance";

function FoodList({ searchText = "", locationText = "" }) {
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

  return (
    <div style={{ textAlign: "left" }}>
      <Alerts foods={availableFoods} />

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
          {availableFoods.length} visible listing{availableFoods.length === 1 ? "" : "s"}
        </span>
      </div>

      {availableFoods.length ? (
        availableFoods.map((food) => (
          <FoodCard key={food._id} food={food} />
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
