import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";

function AddFood() {
  const addFood = useAction(api.food.addFood);

  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async () => {
    const expiryHours = Number(expiry);

    if (!Number.isFinite(expiryHours) || expiryHours <= 0) {
      return;
    }

    await addFood({
      foodName,
      quantity,
      expiryTime: expiryHours,
      location,
    });

    setFoodName("");
    setQuantity("");
    setExpiry("");
    setLocation("");
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

      <button onClick={handleSubmit}>Add Food</button>
    </div>
  );
}

export default AddFood;
