import { useState } from "react";
import { useAction } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../backend/convex/_generated/api";
import { clearStoredAuth, getSessionToken } from "../services/auth";

function AddFood() {
  const addFood = useAction(api.food.addFood);
  const navigate = useNavigate();

  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const expiryHours = Number(expiry);
    const quantityKg = Number(quantity);

    if (!foodName.trim() || !quantity.trim() || !location.trim()) {
      setMessage("Please fill all fields before adding food.");
      return;
    }

    if (!Number.isFinite(quantityKg) || quantityKg <= 0) {
      setMessage("Please enter quantity in kg as a valid number.");
      return;
    }

    if (!Number.isFinite(expiryHours) || expiryHours <= 0) {
      setMessage("Please enter expiry time as valid hours.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const sessionToken = getSessionToken();

      if (!sessionToken) {
        setMessage("Please log in first.");
        return;
      }

      await addFood({
        sessionToken,
        foodName: foodName.trim(),
        quantity: quantityKg,
        expiryTime: expiryHours,
        location: location.trim(),
      });

      setFoodName("");
      setQuantity("");
      setExpiry("");
      setLocation("");
      setMessage("Food added successfully.");
    } catch (error) {
      const errorMessage = String(error);

      if (errorMessage.includes("Unauthorized")) {
        clearStoredAuth();
        navigate("/login", { replace: true });
        return;
      }

      setMessage("Could not add food right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel-card">
      <div className="panel-card__header">
        <p className="eyebrow">Add Listing</p>
        <h2>Publish surplus food in seconds</h2>
        <p className="panel-card__copy">
          Enter the pickup details and let the platform enrich the listing with
          AI priority and delivery guidance.
        </p>
      </div>

      <div className="field-grid">
        <input
          className="field-input"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="Food Name"
        />
        <input
          className="field-input"
          type="number"
          min="0.1"
          step="0.1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity in kg"
        />
      </div>

      <input
        className="field-input"
        type="number"
        min="1"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        placeholder="Enter expiry in hours"
      />
      <input
        className="field-input"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Pickup Location"
      />

      <button className="primary-button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Food"}
      </button>
      {message ? (
        <p className={message.includes("successfully") ? "form-message form-message--success" : "form-message"}>
          {message}
        </p>
      ) : null}
    </section>
  );
}

export default AddFood;
