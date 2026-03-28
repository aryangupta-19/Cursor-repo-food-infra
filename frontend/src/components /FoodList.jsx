import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../convex/api";
import Alerts from "./Alerts";
import FoodCard from "./FoodCard";
import {
  formatExpiryHours,
  formatQuantityKg,
  formatRemainingTime,
  getRemainingExpiryMs,
  getUrgencyLevel,
  matchesFoodFilters,
} from "../services/api";
import { getStoredUser } from "../services/auth";
import { getDeliveryTime } from "../utils/distance";

function FoodList({
  searchText = "",
  locationText = "",
  ngoRequest,
  compact = false,
  urgentOnly = false,
}) {
  const [now, setNow] = useState(0);
  const user = getStoredUser();
  const viewerLocation = user?.location?.trim() || undefined;
  const optimizedFoods =
    useQuery(api.food.getAIOptimizedFoods, {
      viewerRegion: viewerLocation,
      viewerLatitude: user?.latitude,
      viewerLongitude: user?.longitude,
      filterRegion: locationText || undefined,
    }) || [];
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setNow(Date.now());
    }, 0);
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  const matchedFoods = optimizedFoods.filter((food) =>
    matchesFoodFilters(food, searchText, locationText),
  );
  const urgencyFilteredFoods = urgentOnly
    ? matchedFoods.filter(
        (food) =>
          getUrgencyLevel(food.expiryTime) === "high" &&
          food.estimatedDeliverable !== false,
      )
    : matchedFoods;
  const deliverableFoods = urgencyFilteredFoods.filter(
    (food) => !food.claimedBy && food.estimatedDeliverable !== false,
  );
  const nonDeliverableFoods = urgencyFilteredFoods.filter(
    (food) => !food.claimedBy && food.estimatedDeliverable === false,
  );
  const claimedFoods = urgencyFilteredFoods.filter((food) => Boolean(food.claimedBy));
  const activeNgoRequest = ngoRequest ?? {
    location: viewerLocation,
    quantity: 1,
  };

  return (
    <section className="listing-section">
      {!compact && !urgentOnly ? <Alerts foods={deliverableFoods} /> : null}

      <div className="listing-header">
        <div>
          <p className="eyebrow">{compact ? "Dashboard Preview" : "Ranked Listings"}</p>
          <h2>
            {compact
              ? "Latest food items"
              : urgentOnly
                ? "Urgent food opportunities"
                : "AI-optimized food opportunities"}
          </h2>
        </div>
        <span className="listing-count">
          {deliverableFoods.length + nonDeliverableFoods.length + claimedFoods.length} visible listing
          {deliverableFoods.length + nonDeliverableFoods.length + claimedFoods.length === 1 ? "" : "s"}
        </span>
      </div>

      {deliverableFoods.length || nonDeliverableFoods.length || claimedFoods.length ? (
        <div className={compact ? "food-grid food-grid--compact" : "food-grid"}>
          {[...deliverableFoods, ...nonDeliverableFoods, ...claimedFoods].map((food) =>
            compact ? (
              <article
                className={food.claimedBy ? "food-card food-card--claimed" : "food-card"}
                key={food._id}
              >
                <div className="food-card__header">
                  <h3>{food.foodName}</h3>
                  <div className="food-card__badges">
                    <span
                      className={
                        food.estimatedDeliverable !== false
                          ? "delivery-badge delivery-badge--yes"
                          : "delivery-badge delivery-badge--no"
                      }
                    >
                      {food.estimatedDeliverable !== false
                        ? "DELIVERABLE"
                        : "NON-DELIVERABLE"}
                    </span>
                    {food.claimedBy ? <span className="claimed-badge">CLAIMED</span> : null}
                  </div>
                </div>

                <div className="food-card__meta">
                  <span>{formatQuantityKg(food.quantity)}</span>
                  <span>{formatExpiryHours(food.expiryTime)}</span>
                </div>

                <p className="food-card__status">
                  Status: {food.claimedBy ? "Claimed" : "Available"}
                </p>
                <p className="food-card__status">
                  Time left: {formatRemainingTime(getRemainingExpiryMs(food, now))}
                </p>

                <div className="food-card__actions">
                  <Link className="secondary-button auth-link" to={user ? "/foods" : "/login"}>
                    {user ? "See More" : "Log in to see more"}
                  </Link>
                </div>
              </article>
            ) : (
              <FoodCard
                key={food._id}
                food={food}
                deliveryTime={getDeliveryTime(
                  activeNgoRequest.location,
                  food.location,
                  typeof user?.latitude === "number" &&
                    typeof user?.longitude === "number"
                    ? { lat: user.latitude, lng: user.longitude }
                    : null,
                  typeof food.coordinates?.lat === "number" &&
                    typeof food.coordinates?.lng === "number"
                    ? food.coordinates
                    : typeof food.latitude === "number" &&
                        typeof food.longitude === "number"
                      ? { lat: food.latitude, lng: food.longitude }
                      : null,
                )}
                now={now}
              />
            ),
          )}
        </div>
      ) : (
        <div className="empty-state">
          No food listings match this search yet.
        </div>
      )}
    </section>
  );
}

export default FoodList;
