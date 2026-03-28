import { useState } from "react";
import { useAction } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../convex/api";
import { setStoredAuth } from "../services/auth";

function SignupPage() {
  const signup = useAction(api.auth.signup);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !location.trim() || !password.trim()) {
      setMessage("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await signup({
        name: name.trim(),
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
      setMessage("Could not sign up right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel-card auth-page">
      <p className="eyebrow">Create Account</p>
      <h1 className="auth-title">Sign up for FoodConnect</h1>
      <p className="panel-card__copy">
        Create an account to manage food listings and claim opportunities.
      </p>

      <input
        className="field-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
      />
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

      <button className="primary-button" onClick={handleSignup} disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Sign Up"}
      </button>
      {message ? <p className="form-message">{message}</p> : null}
    </section>
  );
}

export default SignupPage;
