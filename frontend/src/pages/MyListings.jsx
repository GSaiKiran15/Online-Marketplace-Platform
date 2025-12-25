import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Listing } from "../components/Listing.jsx";
import "./AllListings.css";
import useUser from "../useUser.js";
import api from "../api/axios.js";

const MyListings = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (!user || isLoading) return;

    const fetchData = async () => {
      try {
        const [listingsRes, profileRes] = await Promise.all([
          api.get("/api/myListings", { params: { user_id: user.uid } }),
          api.get("/api/userProfile", { params: { firebase_uid: user.uid } })
        ]);
        setListings(listingsRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, [user, isLoading]);

  // Map UI-friendly names to database values
  const categoryMap = {
    Electronics: "electronics",
    Vehicles: "vehicles",
    Furniture: "furniture",
    "Home Decor": "home_decor",
    Garden: "garden",
    Clothing: "clothing",
    Accessories: "accessories",
    Books: "books",
    Media: "media",
    "Outdoor Sports": "outdoor_sports",
    "Indoor Sports": "indoor_sports",
    Toys: "toys",
    "Video Games": "video_games",
    Beauty: "beauty",
    Health: "health",
    Services: "services",
    Jobs: "jobs",
    Pets: "pets",
    Misc: "misc",
  };

  const categories = Object.keys(categoryMap);

  const filteredListings =
    selectedCategories.length === 0
      ? listings
      : listings.filter((listing) => {
          const dbCategories = selectedCategories.map(
            (cat) => categoryMap[cat]
          );
          return dbCategories.includes(listing.category);
        });

  const sortedListings = [...filteredListings].sort((a, b) => {
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

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <>
    <div className="listings-container">
      {profile && (
        <div className="user-profile-card">
          <img src={user.photoURL || "/user.png"} alt="Profile" className="profile-avatar" />
          <div className="profile-info">
            <h1>{profile.display_name || "User"}</h1>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Rating</span>
                <span className="stat-value">⭐ {profile.rating} ({profile.reviews_count} reviews)</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Member Since</span>
                <span className="stat-value">
                  {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="section-header">Your Listings</h2>

      <div className="controls-bar">
        <button
          className="control-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          🔍 Filter by Category
        </button>

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

      {showFilters && (
        <div className="category-filters">
          <div className="filter-options">
            {categories.map((cat) => (
              <label key={cat} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="listings-grid">
        {sortedListings.map((listing) => (
          <Listing
            key={listing.id}
            name={listing.title}
            price={listing.price}
            location={listing.location}
            image={listing.image_urls[0]}
            onClick={() => navigate(`/listing/${listing.id}`)}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default MyListings;