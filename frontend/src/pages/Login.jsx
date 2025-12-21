import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      console.log("Login attempt:", email);
      navigate("/");
    } catch (err) {
      setError(
        err.message || "Failed to login. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section auth-section">
      <header className="section-header">
        <p className="eyebrow">Welcome back</p>
        <h1>Log in to your account</h1>
        <p className="subhead">
          Access your saved searches, favorites, and listings.
        </p>
      </header>
      {error && <p>{error}</p>}
      <form className="auth-card" onSubmit={handleLogin}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <p className="helper-text">
          Forgot password? Reset from the create account page for now.
          <br />
          <br />
          No account?{" "}
          <span className="inline-link">
            <Link to="/create-account">Create one</Link>
          </span>
          .
        </p>
      </form>
    </section>
  );
};

export default Login;
