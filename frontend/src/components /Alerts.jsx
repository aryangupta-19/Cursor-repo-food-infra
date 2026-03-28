import { Link } from "react-router-dom";
import { getUrgencyLevel } from "../services/api";

function Alerts({ foods }) {
  const urgentFoodCount = foods.filter(
    (food) => !food.claimedBy && getUrgencyLevel(food.expiryTime) === "high",
  ).length;

  if (!urgentFoodCount) return null;

  return (
    <div className="alert-banner">
      <div>
        {urgentFoodCount === 1
          ? "Urgent food available near you."
          : `${urgentFoodCount} urgent food listings need action nearby.`}
      </div>
      <Link className="alert-banner__button" to="/urgent">
        Show Now
      </Link>
    </div>
  );
}

export default Alerts;
