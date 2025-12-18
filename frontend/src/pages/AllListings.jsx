import React from "react";
import { useLoaderData } from "react-router-dom";
import { Listing } from "../components/Listing.jsx";
import "./AllListings.css";
const AllListings = () => {
  const initialListings = useLoaderData() || [];
  console.log(initialListings);
  return (
    <div className="listings-grid">
      {initialListings.map((listing) => (
        <Listing
          key={listing.id}
          name={listing.title}
          price={listing.price}
          location={listing.location}
        />
      ))}
    </div>
  );
};

export default AllListings;
