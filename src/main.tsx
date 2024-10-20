import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import Landing from "./views/Landing";
import Index from "./views/Index";
import Album from "./views/Album";
import { Provider } from "react-redux";
import { store } from "./global/store";
import Albums from "./views/Albums";
import Artists from "./views/Artists";
import Artist from "./views/Artist";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Index />
      },
      {
        path: "/albums",
        element: <Albums />,
      },
      {
        path: "/albums/:id",
        element: <Album />,
      },
      {
        path: "/artists",
        element: <Artists />,
      },
      {
        path: "/artists/:id",
        element: <Artist />,
      }
    ]
  },
  {
    path: "/landing",
    element: <Landing />
  }
]);



ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
