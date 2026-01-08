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
<div className="navbar-user">👋 Hi, <strong>{userName}</strong></div>
              <Link to="/my-listings" className="navbar-link">
                <img src="/user.png" width={20} height={20} alt="" />
                <span>Account</span>
              </Link>
              <Link to="/create-listing" className="navbar-link">
                <img src="/plus.png" width={20} height={20} alt="" />
                <span>Create Listing</span>
              </Link>
              <Link to="/liked-listings" className="navbar-link">
                <img src="/heart.png" width={20} height={20} alt="" />
                <span>Liked</span>
              </Link>
              <Link to="/chats" className="navbar-link">
                <img src="/chat.png" width={20} height={20} alt="" />
                <span>Chats</span>
              </Link>
              <button onClick={handleLogout} className="logout-button navbar-link">
                <img src="/logout.png" width={20} height={20} alt="" />
                <span>Logout</span>
              </button>
            </nav>
          ) : (
            <nav className="navbar-links">
              <Link to="/login" className="navbar-link">
                <img src="/login.png" width={20} height={20} alt="" />
                <span>Login</span>
              </Link>
              <Link to="/create-account" className="navbar-link">
                <img src="/create.png" width={20} height={20} alt="" />
                <span>Register</span>
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