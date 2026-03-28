import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { Link, useParams } from "react-router-dom";
import { api } from "../convex/api";
import FoodCard from "../components /FoodCard";
import { getStoredUser } from "../services/auth";
import { getDeliveryTime } from "../utils/distance";

function ShowPage() {
  const { foodId } = useParams();
  const user = getStoredUser();
  const [now, setNow] = useState(0);
  const food = useQuery(api.food.getFoodById, foodId ? { id: foodId } : "skip");

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

  if (!foodId) {
    return (
      <section className="panel-card">
        <h2>Listing not found</h2>
        <p className="panel-card__copy">This food listing link is incomplete.</p>
        <Link className="secondary-button auth-link" to="/foods">
          Back to Browse
        </Link>
      </section>
    );
  }

  if (food === undefined) {
    return (
      <section className="panel-card">
        <h2>Loading listing...</h2>
      </section>
    );
  }

  if (food === null) {
    return (
      <section className="panel-card">
        <h2>Listing not found</h2>
        <p className="panel-card__copy">
          This listing may have been removed or is no longer available.
        </p>
        <Link className="secondary-button auth-link" to="/foods">
          Back to Browse
        </Link>
      </section>
    );
  }

  const deliveryTime = getDeliveryTime(
    user?.location,
    food.location,
    typeof user?.latitude === "number" && typeof user?.longitude === "number"
      ? { lat: user.latitude, lng: user.longitude }
      : null,
    typeof food.coordinates?.lat === "number" && typeof food.coordinates?.lng === "number"
      ? food.coordinates
      : typeof food.latitude === "number" && typeof food.longitude === "number"
        ? { lat: food.latitude, lng: food.longitude }
        : null,
  );

  return (
    <section className="show-page">
      <div className="show-page__header">
        <div>
          <p className="eyebrow">Listing Details</p>
          <h1>Full food item view</h1>
        </div>
        <Link className="secondary-button auth-link" to="/foods">
          Back to Browse
        </Link>
      </div>

      <FoodCard food={food} deliveryTime={deliveryTime} details now={now} />
    </section>
  );
}

export default ShowPage;
