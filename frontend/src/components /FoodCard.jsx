import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../../../backend/convex/_generated/api";
import {
  formatExpiryHours,
  formatQuantityKg,
  formatRemainingTime,
  getRemainingExpiryMs,
} from "../services/api";
import { clearStoredAuth, getSessionToken, getStoredUser } from "../services/auth";

function FoodCard({ food, deliveryTime, compact = false, details = false, now = 0 }) {
  const claimFood = useMutation(api.food.claimFood);
  const searchNearbyOrganizations = useAction(api.food.searchNearbyOrganizations);
  const isClaimed = Boolean(food.claimedBy);
  const isDeliverable = food.estimatedDeliverable !== false;
  const user = getStoredUser();
  const [claimMessage, setClaimMessage] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [organizationsMessage, setOrganizationsMessage] = useState("");
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);
  const remainingTime = formatRemainingTime(getRemainingExpiryMs(food, now));

  const handleClaim = async () => {
    if (!user) {
      return;
    }

    const sessionToken = getSessionToken();

    if (!sessionToken) {
      return;
    }

    setIsClaiming(true);
    setClaimMessage("");

    try {
      const result = await claimFood({ id: food._id, sessionToken });

      if (!result?.success) {
        if (result?.message === "Unauthorized") {
          clearStoredAuth();
          setClaimMessage("Your session expired. Please log in again.");
          return;
        }

        setClaimMessage(result?.message ?? "Could not claim this listing.");
        return;
      }

      setClaimMessage("Food claimed successfully.");
    } catch {
      clearStoredAuth();
      setClaimMessage("Your session expired. Please log in again.");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleFindOrganizations = async () => {
    const sessionToken = getSessionToken();

    if (!sessionToken) {
      setOrganizationsMessage("Please log in again to search nearby organizations.");
      return;
    }

    setIsLoadingOrganizations(true);
    setOrganizationsMessage("");

    try {
      const result = await searchNearbyOrganizations({
        sessionToken,
        foodName: food.foodName,
        location: food.location,
      });

      if (!result?.success) {
        setOrganizations([]);
        setOrganizationsMessage(
          result?.message ?? "Could not fetch nearby organizations right now.",
        );
        return;
      }

      setOrganizations(result.organizations ?? []);
      setOrganizationsMessage(
        result.organizations?.length
          ? ""
          : "No nearby organizations found for this listing yet.",
      );
    } catch {
      setOrganizations([]);
      setOrganizationsMessage("Could not fetch nearby organizations right now.");
    } finally {
      setIsLoadingOrganizations(false);
    }
  };

  return (
    <article className={isClaimed ? "food-card food-card--claimed" : "food-card"}>
      <div className="food-card__header">
        <h3>{food.foodName}</h3>
        <div className="food-card__badges">
          <span className="priority-badge">AI Priority {food.priorityScore ?? 0}</span>
          <span
            className={
              isDeliverable ? "delivery-badge delivery-badge--yes" : "delivery-badge delivery-badge--no"
            }
          >
            {isDeliverable ? "DELIVERABLE" : "NON-DELIVERABLE"}
          </span>
          {isClaimed ? <span className="claimed-badge">CLAIMED</span> : null}
        </div>
      </div>

      <div className="food-card__meta">
        <span>{formatQuantityKg(food.quantity)}</span>
        <span>{formatExpiryHours(food.expiryTime)}</span>
        {!compact ? <span>{food.location}</span> : null}
      </div>

      <p className="food-card__status">Status: {isClaimed ? "Claimed" : "Available"}</p>
      <p className="food-card__status">Time left: {remainingTime}</p>

      {compact ? (
        <div className="food-card__actions">
          <Link
            className="secondary-button auth-link"
            to={user ? `/show/${food._id}` : "/login"}
          >
            {user ? "See More" : "Log in to see more"}
          </Link>
        </div>
      ) : !details ? (
        <>
          <div className="food-card__stats">
            <div className="stat-pill">
              <span className="stat-pill__label">Deliverable</span>
              <strong>{isDeliverable ? "Yes" : "No"}</strong>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__label">Delivery Time</span>
              <strong>{deliveryTime !== undefined ? `${deliveryTime} mins` : "N/A"}</strong>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__label">Urgency</span>
              <strong>{food.aiUrgencyLevel ?? "N/A"}</strong>
            </div>
          </div>

          <div className="food-card__actions">
            <Link className="secondary-button auth-link" to={`/show/${food._id}`}>
              Show Nearby NGO
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="food-card__stats">
            <div className="stat-pill">
              <span className="stat-pill__label">Deliverable</span>
              <strong>{isDeliverable ? "Yes" : "No"}</strong>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__label">Delivery Time</span>
              <strong>{deliveryTime !== undefined ? `${deliveryTime} mins` : "N/A"}</strong>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__label">Urgency</span>
              <strong>{food.aiUrgencyLevel ?? "N/A"}</strong>
            </div>
          </div>

          <p className="food-card__insight">
            Estimated people served: {food.aiEstimatedPeopleServed ?? "Not available"}
          </p>
          <p className="food-card__insight">
            Suggested action: {food.aiSuggestedAction ?? "Not available"}
          </p>
          {food.recommendedNGOs?.length ? (
            <div className="ngo-tag-row">
              {food.recommendedNGOs.map((ngo) => (
                <span className="ngo-tag" key={ngo}>
                  {ngo}
                </span>
              ))}
            </div>
          ) : null}

          <div className="organization-section">
            <button
              className="secondary-button organization-button"
              onClick={handleFindOrganizations}
              disabled={isLoadingOrganizations}
            >
              {isLoadingOrganizations ? "Searching..." : "Find Real NGOs with Exa"}
            </button>
            {organizationsMessage ? (
              <p className="food-card__hint">{organizationsMessage}</p>
            ) : null}
            {organizations.length ? (
              <div className="organization-list">
                {organizations.map((organization) => (
                  <a
                    className="organization-card"
                    href={organization.url}
                    key={`${food._id}-${organization.url}-${organization.title}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <strong>{organization.title}</strong>
                    <span>{organization.snippet}</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {isClaimed ? (
            <button className="claim-button claim-button--claimed" disabled>
              Claimed
            </button>
          ) : !isDeliverable ? (
            <button className="claim-button claim-button--claimed" disabled>
              Not Deliverable
            </button>
          ) : (
            <div className="claim-actions">
              <button
                className="claim-button"
                onClick={handleClaim}
                disabled={!user || isClaiming}
              >
                {user ? (isClaiming ? "Claiming..." : "Claim Food") : "Log in to claim"}
              </button>
              {!user ? <p className="food-card__hint">Login required for claiming.</p> : null}
              {claimMessage ? <p className="food-card__hint">{claimMessage}</p> : null}
            </div>
          )}
        </>
      )}
    </article>
  );
}

export default FoodCard;
