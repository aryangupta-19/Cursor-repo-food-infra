import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getStoredUser } from "./services/auth";

function Navbar() {
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
    <header className="site-nav">
      <div className="site-nav__inner">
        <div className="site-brand">
          <div>
            <p className="site-brand__eyebrow">Smart Redistribution</p>
            <h2 className="site-brand__name">FoodConnect</h2>
          </div>
        </div>

        <nav className="site-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "site-link site-link--active" : "site-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "site-link site-link--active" : "site-link"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              isActive ? "site-link site-link--active" : "site-link"
            }
          >
            Add Food
          </NavLink>
          <NavLink
            to="/foods"
            className={({ isActive }) =>
              isActive ? "site-link site-link--active" : "site-link"
            }
          >
            Browse
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? "site-link site-link--active" : "site-link"
            }
          >
            Search
          </NavLink>
          {user ? (
            <>
              <span className="site-user">Hi, {user.name}</span>
              <NavLink
                to="/logout"
                className={({ isActive }) =>
                  isActive ? "site-link site-link--active" : "site-link"
                }
              >
                Log Out
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "site-link site-link--active" : "site-link"
                }
              >
                Log In
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive ? "site-link site-link--active" : "site-link"
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
