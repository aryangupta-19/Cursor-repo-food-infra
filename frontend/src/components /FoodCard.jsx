import { useMutation } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";
import { formatExpiryHours } from "../services/api";

function FoodCard({ food, deliveryTime }) {
  const claimFood = useMutation(api.food.claimFood);

  const handleClaim = async () => {
    await claimFood({ id: food._id });
  };

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <h3>{food.foodName}</h3>
      <p>Quantity: {food.quantity}</p>
      <p>Expiry: {formatExpiryHours(food.expiryTime)}</p>
      <p>Location: {food.location}</p>
      <p>Priority Score: {food.priorityScore ?? 0}</p>
      <p>Deliverable: {food.estimatedDeliverable ? "Yes" : "No"}</p>
      {deliveryTime !== undefined ? <p>Delivery time: {deliveryTime} mins</p> : null}
      <p>AI urgency: {food.aiUrgencyLevel ?? "Not available"}</p>
      <p>
        Estimated people served: {food.aiEstimatedPeopleServed ?? "Not available"}
      </p>
      <p>Suggested action: {food.aiSuggestedAction ?? "Not available"}</p>
      {food.recommendedNGOs?.length ? (
        <p>Recommended NGOs: {food.recommendedNGOs.join(", ")}</p>
      ) : null}
      <p>Status: {food.claimedBy ? "Claimed" : "Available"}</p>

      {food.claimedBy ? (
        <button disabled>Claimed</button>
      ) : (
        <button onClick={handleClaim}>Claim</button>
      )}
    </div>
  );
}

export default FoodCard;
