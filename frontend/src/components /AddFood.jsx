import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";

function AddFood() {
  const addFood = useAction(api.food.addFood);

  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const expiryHours = Number(expiry);

    if (!foodName.trim() || !quantity.trim() || !location.trim()) {
      setMessage("Please fill all fields before adding food.");
      return;
    }

    if (!Number.isFinite(expiryHours) || expiryHours <= 0) {
      setMessage("Please enter expiry time as valid hours.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await addFood({
        foodName: foodName.trim(),
        quantity: quantity.trim(),
        expiryTime: expiryHours,
        location: location.trim(),
      });

      setFoodName("");
      setQuantity("");
      setExpiry("");
      setLocation("");
      setMessage("Food added successfully.");
    } catch {
      setMessage("Could not add food right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Add Food</h2>

      <input value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="Food Name" />
      <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" />
      <input
        type="number"
        min="1"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        placeholder="Enter expiry in hours"
      />
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Food"}
      </button>
      {message ? <p>{message}</p> : null}
    </div>
  );
}

export default AddFood;
