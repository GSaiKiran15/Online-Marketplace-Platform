import React, { useState } from "react";
import "./ListingDescription.css";

export const ListingDescription = () => {
  const fake_data = {
    title: "2021 Kawasaki zx6-r",
    price: "9,000",
    location: "Loveland, CO",
    category: "product", // or "product" for general items
    description: [
      "Driven 13,500 miles",
      "Exterior color: Gold",
      "Fuel type: Gasoline",
      "2021 krt edition 636 clean title in my name Not looking for trades unless maybe other bike+cash dm questions or inquires minor cosmetic scuffs just from usage",
    ],
    seller_info: {
      name: "Nick",
      rating: 5,
    },
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=80",
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200&q=80",
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1200&q=80",
      "https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=1200&q=80",
    ],
  };

  const isVehicle = fake_data.category === "vehicle";

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % fake_data.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + fake_data.images.length) % fake_data.images.length
    );
  };
  console.log("Rendering");
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
            src={fake_data.images[currentImageIndex]}
            alt={`${fake_data.title} - Image ${currentImageIndex + 1}`}
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
          {fake_data.images.map((_, index) => (
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
                <h1 className="details-title">{fake_data.title}</h1>
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
                  {fake_data.location}
                </p>
              </div>
              <div className="price-card">
                <p className="price-label">Asking Price</p>
                <p className="details-price">${fake_data.price}</p>
              </div>
            </div>

            {isVehicle ? (
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Vehicle Details
                </h2>
                <div className="specs-grid">
                  {fake_data.description.slice(0, 3).map((item, index) => (
                    <div key={index} className="spec-card">
                      <div className="spec-icon">
                        {index === 0 && "🛣️"}
                        {index === 1 && "🎨"}
                        {index === 2 && "⛽"}
                      </div>
                      <p className="spec-text">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="description-box">
                  <p className="description-text">{fake_data.description[3]}</p>
                </div>
              </div>
            ) : (
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
                <div className="product-info-grid">
                  {fake_data.description.slice(0, -1).map((item, index) => (
                    <div key={index} className="info-item">
                      <div className="info-bullet">•</div>
                      <p className="info-text">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="description-box">
                  <h3 className="description-heading">Description</h3>
                  <p className="description-text">
                    {fake_data.description[fake_data.description.length - 1]}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="details-sidebar">
            <div className="seller-card">
              <h3 className="seller-card-title">Seller Information</h3>
              <div className="seller-profile">
                <div className="seller-avatar">
                  {fake_data.seller_info.name.charAt(0)}
                </div>
                <div className="seller-details">
                  <p className="seller-name">{fake_data.seller_info.name}</p>
                  <div className="seller-rating">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={
                          i < fake_data.seller_info.rating
                            ? "star-filled"
                            : "star-empty"
                        }
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={
                          i < fake_data.seller_info.rating
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
                      {fake_data.seller_info.rating}.0
                    </span>
                  </div>
                  <p className="seller-meta">Member since 2023</p>
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
              <button className="favorite-btn">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Save Listing
              </button>
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
