import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Layout.css";
import useUser from "../../useUser";
import { getAuth, signOut } from "firebase/auth";
const Layout = ({ children }) => {
  const {user, isLoading, userName} = useUser()
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="layout">
      <header className="navbar">
        <Link to="/" className="navbar-brand">
          MarketPulse
        </Link>

        {!isLoading && (
          user ? (
            <nav className="navbar-links">
              <span className="navbar-user">Hi, {userName}</span>
              <Link to="/my-listings" className="navbar-link">My Listings</Link>
              <Link to="/" className="navbar-link">
                Listings
              </Link>
              <Link to="/create-listing" className="navbar-link">Create Listing</Link>

              <Link to="/liked-listings" className="navbar-link">Liked Listings</Link>
              <button onClick={handleLogout} className="logout-button navbar-link">Logout</button>
            </nav>
          ) : (
            <nav className="navbar-links">
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/create-account" className="navbar-link">
                Create Account
              </Link>
            </nav>
          )
        )}
      </header>

      <main className="layout-content">{children}</main>
    </div>
  );
};

export default Layout;