import admin from "firebase-admin";
import { createRequire } from "module";
import { supabase } from "./supabaseClient.js";
import express from "express";
import fs from "fs";

const require = createRequire(import.meta.url);
const serviceAccount = require("../credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.post("/api/newUser", (req, res) => {});

app.get("/api/feed", async (req, res) => {
  // Run the select to actually fetch rows and return an error response if it fails
  const { data, error } = await supabase.from("listings").select();

  if (error) {
    console.error("/api/feed supabase error", error);
    return res.status(500).json({ message: "Failed to load feed" });
  }
  res.json(data ?? []);
});

app.listen(8000, (req, res) => {
  console.log("Server is up and running.");
});
