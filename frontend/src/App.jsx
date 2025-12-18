import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import AllListings from "./pages/AllListings.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Login from "./pages/Login.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import { ListingDescription } from "./pages/ListingDescription.jsx";

const routes = [
  {
    path: "/",
    element: (
      <Layout>
        <AllListings />
      </Layout>
    ),
    loader: async () => {
      try {
        const response = await axios.get("/api/feed");
        return response.data
      } catch (error) {
        console.error("Failed to load listings:", error);
        return [];
      }
    },
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  {
    path: "/listing",
    element: <ListingDescription/>
  },
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
