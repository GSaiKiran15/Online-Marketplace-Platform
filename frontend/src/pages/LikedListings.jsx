import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Listing } from "../components/Listing.jsx";
import "./LikedListings.css";
import useUser from "../useUser.js";
import axios from "axios";

const LikedListings = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const [likedListings, setLikedListings] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
  if (!user) return;

  const fetchLikedListings = async () => {
    try {
      const response = await axios.get("/api/likedListings", {
        params: { firebase_uid: user.uid },
      });
      setLikedListings(response.data);
    } catch (err) {
      console.error("Failed to fetch liked listings", err);
    }
  };

  fetchLikedListings();
}, [user]);

  const sortedListings = [...likedListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      default:
        return 0;
    }
  });

  return (
    <div className="liked-listings-container">
      <div className="liked-header">
        <h1>❤️ Liked Listings</h1>
        <p className="liked-subtitle">Your saved items all in one place</p>
      </div>

      {likedListings.length > 0 && (
        <div className="controls-bar">
          <div className="sort-control">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      )}

      {likedListings.length === 0 ? (
        <div className="empty-state">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h2>No Liked Listings Yet</h2>
          <p>Start browsing and save your favorite items!</p>
          <button className="browse-button" onClick={() => navigate("/")}>
            Browse Listings
          </button>
        </div>
      ) : (
        <div className="listings-grid">
          {sortedListings.map((listing) => (
            <Listing
              key={listing.id}
              name={listing.title}
              price={listing.price}
              location={listing.location}
              image={listing.image_urls?.[0]}
              onClick={() => navigate(`/listing/${listing.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedListings;