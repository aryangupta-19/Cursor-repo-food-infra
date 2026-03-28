import { getUrgencyLevel } from "../services/api";

function Alerts({ foods }) {
  const urgentFoodCount = foods.filter(
    (food) => !food.claimedBy && getUrgencyLevel(food.expiryTime) === "high",
  ).length;

  if (!urgentFoodCount) return null;

  return (
    <div
      style={{
        background: "#d7263d",
        color: "white",
        padding: "12px 16px",
        marginBottom: "16px",
        borderRadius: "10px",
        textAlign: "left",
      }}
    >
      {urgentFoodCount === 1
        ? "Urgent food available near you."
        : `${urgentFoodCount} urgent food listings need action nearby.`}
    </div>
  );
}

export default Alerts;
