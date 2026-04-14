import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginForm.css";

/** @param {{ variant: "login" | "register" }} props */
function LoginForm({ variant }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search || ""}`
    : "/";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (variant === "login") {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.detail ??
        (typeof err.response?.data === "string"
          ? err.response.data
          : "Something went wrong");
      setError(Array.isArray(msg) ? msg.map((m) => m.msg).join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">
        {variant === "login" ? "Sign in" : "Create account"}
      </h2>
      <p className="auth-sub">
        Your progress and adaptive practice are saved to your account.
      </p>

      <form onSubmit={submit} className="auth-form">
        {variant === "register" && (
          <label className="auth-label">
            Name
            <input
              type="text"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </label>
        )}
        <label className="auth-label">
          Email
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label className="auth-label">
          Password
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={
              variant === "login" ? "current-password" : "new-password"
            }
          />
        </label>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading
            ? "Please wait…"
            : variant === "login"
              ? "Sign in"
              : "Register"}
        </button>
      </form>

      {variant === "login" ? (
        <p className="auth-footer-text">
          Need an account?{" "}
          <Link
            to="/register"
            state={location.state}
            className="auth-inline-link"
          >
            Register
          </Link>
        </p>
      ) : (
        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
            className="auth-inline-link"
          >
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}

export default LoginForm;
