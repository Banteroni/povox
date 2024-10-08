import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import Landing from "./views/Landing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: []
  },
  {
    path: "/landing",
    element: <Landing/>
  }
]);



ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
