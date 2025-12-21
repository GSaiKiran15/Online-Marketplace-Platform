import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from "firebase/auth";
import axios from "axios";
import { useState } from "react";

const CreateAccount = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password
      );

      // Add display name to Firebase Auth profile
      await updateProfile(credential.user, {
        displayName: name,
      });

      const uid = credential.user.uid
      await axios.post("/api/newUser", {uid, email, name})
      console.log("Account creation attempt:", email);

      // Navigate to projects after successful registration
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section auth-section">
      <header className="section-header">
        <p className="eyebrow">Join the community</p>
        <h1>Create an account</h1>
        <p className="subhead">
          Post items, manage offers, and sync your activity across devices.
        </p>
      </header>
      {error && <p>{error}</p>}
      <form className="auth-card">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Alex Doe"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          onClick={handleCreateAccount}
        >
          Create account
        </button>
        <p className="helper-text">
          By continuing you agree to our marketplace terms.<br></br>
          <br></br> Already have an account?{" "}
          <span className="inline-link">
            <Link to="/login">Log in</Link>.
          </span>
        </p>
      </form>
    </section>
  );
};

export default CreateAccount;
