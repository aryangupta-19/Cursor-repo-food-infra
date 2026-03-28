import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";
import Alerts from "./Alerts";
import FoodCard from "./FoodCard";
import { matchesFoodFilters } from "../services/api";
import { getDeliveryTime } from "../utils/distance";

function FoodList({ searchText = "", locationText = "", ngoRequest }) {
  const optimizedFoods =
    useQuery(api.food.getAIOptimizedFoods, {
      region: locationText || undefined,
    }) || [];
  const rankedFoods = optimizedFoods.filter(
    (food) =>
      matchesFoodFilters(food, searchText, locationText),
  );
  const activeNgoRequest = ngoRequest ?? {
    location: locationText,
    quantity: 1,
  };

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
          <FoodCard
            key={food._id}
            food={food}
            deliveryTime={getDeliveryTime(activeNgoRequest.location, food.location)}
          />
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
