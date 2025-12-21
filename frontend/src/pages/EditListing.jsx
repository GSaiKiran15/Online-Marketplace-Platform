import React, { useState, useEffect } from "react";
import "./CreateListing.css";
import useUser from "../useUser.js";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const categoryMap = {
  "Electronics": "electronics",
  "Vehicles": "vehicles",
  "Furniture": "furniture",
  "Home Decor": "home_decor",
  "Garden": "garden",
  "Clothing": "clothing",
  "Accessories": "accessories",
  "Books": "books",
  "Media": "media",
  "Outdoor Sports": "outdoor_sports",
  "Indoor Sports": "indoor_sports",
  "Toys": "toys",
  "Video Games": "video_games",
  "Beauty": "beauty",
  "Health": "health",
  "Services": "services",
  "Jobs": "jobs",
  "Pets": "pets",
  "Misc": "misc",
}

const categories = Object.keys(categoryMap);

export const EditListing = () => {
  const navigate = useNavigate();
  const {user, isLoading} = useUser();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("")
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null)

  const { id } = useParams();
  
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchListing = async () => {
      try {
        const response = await axios.get(`/api/listing/${id}`);
        const listing = response.data;
        setTitle(listing.title);
        setPrice(listing.price);
        setCategory(listing.category);
        setDescription(listing.description);
        setLocation(listing.location);
        setImages(listing.images || []);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      }
    };

    fetchListing();
  }, [user, isLoading, navigate, id]);

const handleSubmit = async (e) => {
  e.preventDefault()

  // Safety check: ensure user is authenticated
  if (!user) {
    setError("You must be logged in to create a listing");
    navigate("/login");
    return;
  }

  const listingResult = {
    title,
    price,
    category: categoryMap[category],
    description,
    location,
    user_id: user.uid
  }

  setResult(listingResult)
  console.log(listingResult)
  const response = await axios.put(`/api/listing/${id}`, listingResult)
  console.log(response.data)
  navigate("/")
}

  return (
    <section className="create-listing-section">
      <h1>Edit Listing</h1>
      <form className="create-listing-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
            placeholder="Enter product title"
          />
        </div>
        <div className="form-field">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="Enter price"
          />
        </div>
        <div className="form-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Describe your product..."
          />
        </div>
        <div className="form-field">
          <label htmlFor="title">Location</label>
          <input
            id="title"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            maxLength={100}
            placeholder="City, State or Zip"
          />
        </div>
        <button className="btn-primary" type="submit">
          Edit Listing
        </button>
      </form>
    </section>
  );
};

export default EditListing;