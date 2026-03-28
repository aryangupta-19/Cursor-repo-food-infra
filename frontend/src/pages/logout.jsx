import { useEffect } from "react";
import { useAction } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../convex/api";
import { clearStoredAuth, getSessionToken } from "../services/auth";

function LogoutPage() {
  const navigate = useNavigate();
  const logout = useAction(api.auth.logout);

  useEffect(() => {
    const performLogout = async () => {
      const sessionToken = getSessionToken();

      if (sessionToken) {
        try {
          await logout({ sessionToken });
        } catch {
          // Ignore backend logout errors and clear local session anyway.
        }
      }

      clearStoredAuth();
      navigate("/");
    };

    performLogout();
  }, [logout, navigate]);

  return null;
}

export default LogoutPage;
