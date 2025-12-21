import React from "react";
import "./Listing.css";

const placeholderImage = "/no-pictures.png";

export const Listing = ({ image = null, name, price, location, onClick }) => {
  const displayPrice =
    typeof price === "number"
      ? `$${price.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`
      : price || "—";

  const handleKeyDown = (event) => {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      className={`listing-card ${onClick ? "listing-card--clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={`${name || "Listing"}${location ? ` in ${location}` : ""}`}
    >
      <div className="listing-image-wrap">
        <img
          src={image || placeholderImage}
          alt={name || "Listing image"}
          className="listing-image"
          onError={(e) => {
            e.currentTarget.src = placeholderImage;
          }}
        />
      </div>
      <div className="listing-body">
        <div className="listing-header">
          <p className="listing-name" title={name}>
            {name || "Untitled listing"}
          </p>
          <span className="listing-price">{displayPrice}</span>
        </div>
        {location && <p className="listing-location">{location}</p>}
      </div>
    </article>
  );
};