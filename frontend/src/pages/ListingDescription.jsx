import React, { useEffect, useState } from "react";
import "./ListingDescription.css";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import useUser from "../useUser";

export const ListingDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { user, isLoading } = useUser();

 useEffect(() => {
  if (!user || isLoading) return; // ⛔ wait for auth

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/listing/${id}`, {
        params: { firebase_uid: user.uid },
      });

      setListing(response.data);
      setIsLiked(response.data.isLiked);
      setIsOwner(response.data.user_id === user.uid);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load listing", err);
      setLoading(false);
    }
  };

  fetchData();
}, [id, user, isLoading]);


  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.image_urls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + listing.image_urls.length) % listing.image_urls.length
    );
  };

  const handleSaveListing = async () => {
    if (!user) {
      alert("Please login to save listings");
      return;
    }
    
    if (!isLiked) {
      try {
        const response = await api.post("/api/likeListing", {
          firebase_uid: user.uid,
          listing_id: listing.id
        });
        
        if (response.status === 200) {
          setIsLiked(true);
          console.log("Listing saved!", response.data);
        }
      } catch (error) {
        console.error("Failed to save listing:", error);
        alert("Failed to save listing. Please try again.");
      }
    } else {
      try {
        const response = await api.post("/api/unlikeListing", {
          firebase_uid: user.uid,
          listing_id: listing.id
        });
        
        if (response.status === 200) {
          setIsLiked(false);
          console.log("Listing unliked!", response.data);
        }
      } catch (error) {
        console.error("Failed to unlike listing:", error);
        alert("Failed to unlike listing. Please try again.");
      }
    }
  };  

  const handleEditListing = () => {
    navigate(`/edit-listing/${listing.id}`);
  };
    
  console.log(listing);
  if (loading) return <p>Loading...</p>;
  return (
    <div className="listing-description">
      <div className="hero-carousel">
        <button
          className="carousel-btn carousel-btn-prev"
          onClick={prevImage}
          aria-label="Previous image"
        >
          ‹
        </button>
        <div className="carousel-image-container">
          <img
            src={listing.image_urls[currentImageIndex]}
            alt={`${listing.title} - Image ${currentImageIndex + 1}`}
            className="carousel-image"
          />
        </div>
        <button
          className="carousel-btn carousel-btn-next"
          onClick={nextImage}
          aria-label="Next image"
        >
          ›
        </button>
        <div className="carousel-indicators">
          {listing.image_urls.map((_, index) => (
            <button
              key={index}
              className={`indicator ${
                index === currentImageIndex ? "indicator-active" : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="listing-details">
        <div className="details-grid">
          <div className="details-main">
            <div className="details-header">
              <div>
                <span className="listing-badge">Featured</span>
                <h1 className="details-title">{listing.title}</h1>
                <p className="details-location">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {listing.location}
                </p>
              </div>
              <div className="price-card">
                <p className="price-label">Asking Price</p>
                <p className="details-price">${Number(listing.price).toLocaleString()}</p>
              </div>
            </div>

            <div className="details-section">
              <h2 className="section-title">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 7h-9a2 2 0 0 1-2-2V2" />
                  <path d="M4 21v-7h4v7" />
                  <path d="M4 14l8-8 8 8" />
                  <line x1="4" y1="10" x2="12" y2="2" />
                </svg>
                Product Details
              </h2>
              <div className="description-box">
                <h3 className="description-heading">Description</h3>
                <p className="description-text" style={{ whiteSpace: 'pre-wrap' }}>
                  {listing.description}
                </p>
              </div>
            </div>
          </div>

          <div className="details-sidebar">
            <div className="seller-card">
              <h3 className="seller-card-title">Seller Information</h3>
              <div className="seller-profile">
                <div className="seller-avatar">
                  {listing.user.display_name.charAt(0)}
                </div>
                <div className="seller-details">
                  <p className="seller-name">{listing.user.display_name}</p>
                  <div className="seller-rating">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={
                          i < listing.user.rating
                            ? "star-filled"
                            : "star-empty"
                        }
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={
                          i < listing.user.rating
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                    <span className="rating-text">
                      {listing.user.rating}.0
                    </span>
                  </div>
                  <p className="seller-meta">Member since {listing.user.created_at.slice(0,4)}</p>
                </div>
              </div>
              <button className="contact-btn">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Contact Seller
              </button>
              {isOwner ? <button className="edit-btn" onClick={() => navigate(`/edit-listing/${listing.id}`)}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                Edit Listing
              </button> : <button className="favorite-btn" onClick={() => handleSaveListing(listing)}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "#ef4444" : "none"}
                  stroke={isLiked ? "#ef4444" : "currentColor"}
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {isLiked ? "Saved" : "Save Listing"}
              </button>}
            </div>

            <div className="safety-card">
              <h3 className="safety-title">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Safety Tips
              </h3>
              <ul className="safety-list">
                <li>Meet in a safe, public location</li>
                <li>Inspect the item before purchasing</li>
                <li>Never wire funds or share payment info</li>
                <li>Verify seller identity and ownership</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};