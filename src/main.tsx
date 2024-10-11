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
        element: <div>Albums</div>,
      },
      {
        path: "/albums/:id",
        element: <Album/>,
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
