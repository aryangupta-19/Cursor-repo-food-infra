import {
  getEstimatedPeopleServed,
  getSuggestedAction,
  getUrgencyLevel,
  normalizeText,
  formatExpiryHours,
} from "../services/api";

function AISuggestion({ food, viewerLocation }) {
  const urgency = getUrgencyLevel(food.expiryTime);
  const peopleServed = getEstimatedPeopleServed(food.quantity);
  const isNearby =
    !viewerLocation ||
    normalizeText(food.location).includes(normalizeText(viewerLocation));

  return (
    <div
      style={{
        marginTop: "12px",
        background: "#f6f7fb",
        border: "1px solid #dde3f0",
        borderRadius: "10px",
        padding: "10px 12px",
        textAlign: "left",
      }}
    >
      <strong>AI insight</strong>
      <p>Expiry window: {formatExpiryHours(food.expiryTime)}</p>
      <p>Urgency: {urgency}</p>
      <p>Estimated people served: {peopleServed}</p>
      <p>Suggested action: {getSuggestedAction(food, isNearby)}</p>
    </div>
  );
}

export default AISuggestion;
