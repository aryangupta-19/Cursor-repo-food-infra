import { useState } from "react";
import { useAction } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../convex/api";
import { setStoredAuth } from "../services/auth";

function LoginPage() {
  const login = useAction(api.auth.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !location.trim() || !password.trim()) {
      setMessage("Please enter email, location, and password.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await login({
        email: email.trim(),
        location: location.trim(),
        password,
      });

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setStoredAuth({
        user: result.user,
        sessionToken: result.sessionToken,
      });
      navigate("/");
    } catch {
      setMessage("Could not log in right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel-card auth-page">
      <p className="eyebrow">Welcome Back</p>
      <h1 className="auth-title">Log in to continue</h1>
      <p className="panel-card__copy">
        Access your account to browse, add, and claim food listings.
      </p>

      <input
        className="field-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="field-input"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Your city for delivery estimates"
      />
      <input
        className="field-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button className="primary-button" onClick={handleLogin} disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>
      {message ? <p className="form-message">{message}</p> : null}
    </section>
  );
}

export default LoginPage;
