import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className="layout">
      <header className="navbar">
        <Link to="/" className="navbar-brand">
          MarketPulse
        </Link>
        <nav className="navbar-links">
          <Link to="/" className="navbar-link">
            Listings
          </Link>
          <Link to="/login" className="navbar-link">
            Login
          </Link>
          <Link to="/create-account" className="navbar-link">
            Create Account
          </Link>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </nav>
      </header>
      <main className="layout-content">{children}</main>
    </div>
  );
};

export default Layout;
