import React, { useState, useEffect } from "react";
import "./CreateListing.css";
import useUser from "../useUser.js";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

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

export const CreateListing = () => {
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

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      setError("You can upload up to 10 images only.");
      return;
    }
    setImages((prev) => [...prev, ...files].slice(0, 10));
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length + images.length > 10) {
      setError("You can upload up to 10 images only.");
      return;
    }
    setImages((prev) => [...prev, ...files].slice(0, 10));
    setError("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

const handleSubmit = async (e) => {
  e.preventDefault()

  // Safety check: ensure user is authenticated
  if (!user) {
    setError("You must be logged in to create a listing");
    navigate("/login");
    return;
  }

  const uploadPromises = images.map(async (image) => {
    if (!image) return null

    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "marketplace")
    data.append("cloud_name", "dczaga6r0")

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dczaga6r0/image/upload",
      {
        method: "POST",
        body: data,
      }
    )

    const result = await res.json()
    return result.secure_url
  })

  const uploadedImageUrls = await Promise.all(uploadPromises)

  const listingResult = {
    title,
    price,
    category: categoryMap[category],
    description,
    location,
    images: uploadedImageUrls.filter(Boolean),
    user_id: user.uid
  }

  setResult(listingResult)
  console.log(listingResult)
  const response = await api.post("/api/newListing", listingResult)
  console.log(response.data)
  navigate("/")
}

  return (
    <section className="create-listing-section">
      <h1>Create a New Listing</h1>
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
        <div className="form-field">
          <label>Photos (up to 10)</label>
          <div
            className="image-dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="image-upload"
            />
            <label htmlFor="image-upload" className="image-upload-label">
              Drag & drop or click to select images
            </label>
            <div className="image-preview-list">
              {images.map((img, idx) => (
                <div key={idx} className="image-preview-item">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${idx}`}
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeImage(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>
        <button className="btn-primary" type="submit">
          Create Listing
        </button>
      </form>
    </section>
  );
};

export default CreateListing;