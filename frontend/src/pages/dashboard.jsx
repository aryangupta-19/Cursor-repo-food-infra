import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FoodList from "../components /FoodList";
import { getStoredUser } from "../services/auth";

function Dashboard() {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const syncUser = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("auth-changed", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("auth-changed", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  return (
    <div className="dashboard-page">
      <section className="panel-card auth-cta-panel">
        <p className="eyebrow">Account Access</p>
        <h2>{user ? `Welcome back, ${user.name}.` : "Access your FoodConnect account."}</h2>
        <p className="panel-card__copy">
          {user
            ? "You are already logged in and can continue managing listings."
            : "Log in or create an account to unlock claiming and protected routes."}
        </p>
        <div className="chip-row">
          {user ? (
            <>
              <Link className="primary-button auth-link" to="/foods">
                Open Listings
              </Link>
              <Link className="secondary-button auth-link" to="/logout">
                Log Out
              </Link>
            </>
          ) : (
            <>
              <Link className="primary-button auth-link" to="/signup">
                Sign Up
              </Link>
              <Link className="secondary-button auth-link" to="/login">
                Log In
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="panel-card">
        <div className="listing-header">
          <div>
            <p className="eyebrow">Live Dashboard Feed</p>
            <h2>Current food opportunities</h2>
          </div>
          <span className="listing-count">
            {user ? "Logged in: full access enabled" : "Read-only until login"}
          </span>
        </div>

        {!user ? (
          <div className="auth-notice">
            Log in to add food, open the dedicated search page, and claim listings.
          </div>
        ) : null}

        <FoodList compact />
      </section>
    </div>
  );
}

export default Dashboard;
