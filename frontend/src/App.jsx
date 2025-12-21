import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import api from "./api/axios.js";
import AllListings from "./pages/AllListings.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Login from "./pages/Login.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import { ListingDescription } from "./pages/ListingDescription.jsx";
import { CreateListing } from "./pages/CreateListing.jsx";
import LikedListings from "./pages/LikedListings.jsx";
import MyListings from "./pages/MyListings.jsx";
import EditListing from "./pages/EditListing.jsx";
const routes = [
  {
    path: "/",
    element: (
      <Layout>
        <AllListings />
      </Layout>
    ),
    loader: async () => {
      const { getAuth, onAuthStateChanged } = await import("firebase/auth");
      const user = await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
          unsubscribe();
          resolve(user);
        });
      });
      
      if (!user) return [];
      try {
        const response = await api.get("/api/feed");
        return response.data;
      } catch (error) {
        console.error("Failed to load listings:", error);
        return [];
      }
    },
  },
  {
    path: "/login",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: "/create-account",
    element: (
      <Layout>
        <CreateAccount />
      </Layout>
    ),
  },
  {
    path: "/listing/:id",
    element: (
      <Layout>
        <ListingDescription />
      </Layout>
    ),
  },
  {
    path: "/create-listing",
    element: (
      <Layout>
        <CreateListing/>
      </Layout>
    ),
  },
  {
    path: "/liked-listings",
    element: (
      <Layout>
        <LikedListings />
      </Layout>
    ),
  },
  {
    path: "/my-listings",
    element: (
      <Layout>
        <MyListings />
      </Layout>
    ),
  },
  {
    path: "/edit-listing/:id",
    element: (
      <Layout>
        <EditListing />
      </Layout>
    ),
  }
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
