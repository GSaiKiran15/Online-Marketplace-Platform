import admin from "firebase-admin";
import { createRequire } from "module";
import { supabase } from "./supabaseClient.js";
import express from "express";

const require = createRequire(import.meta.url);

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var", e);
  }
} else {
  // Fallback to local file for development
  try {
    serviceAccount = require("../credentials.json");
  } catch (e) {
    console.warn("No credentials.json found and no FIREBASE_SERVICE_ACCOUNT env var set.");
  }
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

import cors from "cors";

// ... imports

const app = express();

app.use(cors());
// CRITICAL: Parse JSON request bodies
app.use(express.json());

app.get("/api/", async (req, res) => {
  res.send("Hello World!");
});

app.get("/api/feed", async (req, res) => {
  // Run the select to actually fetch rows and return an error response if it fails
  const { data, error } = await supabase.from("listings").select();

  if (error) {
    console.error("/api/feed supabase error", error);
    return res.status(500).json({ message: "Failed to load feed" });
  }
  console.log(data);
  res.json(data ?? []);
});

app.get("/api/listing/:id", async (req, res) => {
  const { id } = req.params;
  const { firebase_uid } = req.query; // pass this from frontend

  // 1️⃣ Get the listing + owner profile
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select(`
      *,
      user:profiles!listings_user_id_fkey (*)
    `)
    .eq("id", id)
    .single();

  if (listingError) {
    console.error("listing error", listingError);
    return res.status(500).json(listingError);
  }

  // 2️⃣ Check if user liked this listing
  let isLiked = false;

  if (firebase_uid) {
    const { data: likeRow, error: likeError } = await supabase
      .from("likes")
      .select("listing_id")
      .eq("firebase_uid", firebase_uid)
      .eq("listing_id", id)
      .maybeSingle();

    if (!likeError && likeRow) {
      isLiked = true;
    }
  }

  // 3️⃣ Return combined response
  res.json({
    ...listing,
    isLiked,
  });
});



app.get("/api/test", async (req, res) => {
  const { data, error } = await supabase.from("profiles").select("*").limit(1);

  console.log("DATA:", data);
  console.log("ERROR:", error);

  res.json({ data, error });
});

app.post("/api/newUser", async (req, res) => {
  const { uid, email, name } = req.body;
  const { data, error } = await supabase.from("profiles").insert({ firebase_uid: uid, email, display_name: name });
  if (error) {
    console.error("/api/newUser supabase error", error);
    return res.status(500).json({ message: "Failed to create user" });
  }
  console.log(data);
  res.json(data ?? []);
});

app.post("/api/newListing", async (req, res) => {
  // const { listingResult} = req.body;
  const { title, price, category, description, location, images, user_id } = req.body;
  const { data, error } = await supabase.from("listings").insert({ title, price, category, description, location, image_urls: images, user_id });
  if (error) {
    console.error("/api/newListing supabase error", error);
    return res.status(500).json({ message: "Failed to create listing" });
  }
  console.log(data);
  res.json(data ?? []);
});

app.get("/api/likedListings", async (req, res) => {
  const { firebase_uid } = req.query; // ✅ FIX

  console.log("🔥 firebase_uid:", firebase_uid);

  const { data, error } = await supabase
    .from("likes")
    .select(`
      listing_id,
      listings (*)
    `)
    .eq("firebase_uid", firebase_uid);

  if (error) {
    console.error("/api/likedListings supabase error", error);
    return res.status(500).json({ message: "Failed to load liked listings" });
  }

  // return only listings (cleaner for frontend)
  res.json(data.map(row => row.listings));
});


app.post("/api/likeListing", async (req, res) => {
  const { firebase_uid, listing_id } = req.body;

  const { data, error } = await supabase
    .from("likes")
    .insert({
      firebase_uid,
      listing_id,
    })
    .select()
    .single();

  console.log(data);
  if (error) {
    if (error.code === "23505") {
      return res.status(200).json({ liked: true });
    }

    console.error("likeListing error:", error);
    return res.status(500).json({ message: "Failed to like listing" });
  }

  res.status(200).json({ liked: true });
});

app.post("/api/unlikeListing", async (req, res) => {
  const { firebase_uid, listing_id } = req.body;

  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("firebase_uid", firebase_uid)
    .eq("listing_id", listing_id);

  if (error) {
    console.error("unlikeListing error:", error);
    return res.status(500).json({ message: "Failed to unlike listing" });
  }

  res.status(200).json({ liked: false });
});

app.get("/api/myListings", async (req, res) => {
  const { user_id } = req.query;

  const { data, error } = await supabase
    .from("listings")
    .select(`
      *
    `)
    .eq("user_id", user_id);

  if (error) {
    console.error("/api/myListings supabase error", error);
    return res.status(500).json({ message: "Failed to load my listings" });
  }

  res.json(data);
});

app.put("/api/listing/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price, category, description, location, user_id } = req.body;

  const { data, error } = await supabase
    .from("listings")
    .update({ title, price, category, description, location, user_id })
    .eq("id", id)
    .select()
    .single();

  console.log(data);
  if (error) {
    console.error("updateListing error:", error);
    return res.status(500).json({ message: "Failed to update listing" });
  }

  res.status(200).json({ updated: true });
});

// Export the Express API directly for Vercel
export default app;

// Only start the server if we're not in a serverless environment (e.g. local dev)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
  });
}
