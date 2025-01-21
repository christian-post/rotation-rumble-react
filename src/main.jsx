import React from "react"
import ReactDOM from "react-dom/client"
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import "./assets/index.css"
import "./assets/font-awesome-4.7.0/css/font-awesome.css"

import Root from "./routes/root";
import Index from "./routes/index";
import AdvancedSearch from "./routes/advanced-search";
import ErrorPage from "./routes/error-page";
import Results from "./routes/results";
import Deckbuilder from "./routes/deckbuilder";
import deckbuilderLoader from	"./utils/DeckbuilderLoader";
import SingleCard from "./routes/singlecard";
import cardLoader from "./utils/CardLoader";
import galleryLoader from "./utils/GalleryLoader";
import Test from "./routes/test";
import CardGallery from "./routes/card-gallery";


const isDevelopment = import.meta.env.MODE === "development"; // For Vite


const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          children: [
            {
              index: true, 
              element: <Index />
            },
            {
              path: "advanced-search",
              element: <AdvancedSearch />
            },
            {
              path: "card-gallery/:groupBy?",
              element: <CardGallery />,
              loader: ({ params }) => {
                // sort by cardtype by default
                const groupBy = params.groupBy || "cardtype"; 
                return galleryLoader({ params: { groupBy } });
              }
            },
            {
              path: "results",
              element: <Results />
            },
            {
              path: "card/:cardId",
              element: <SingleCard />,
              loader: cardLoader,
            },
            {
              path: "deckbuilder",
              element: <Deckbuilder />,
              loader: deckbuilderLoader
            },
            {
              path: "test",
              element: <Test />,
              loader: galleryLoader
            },
            {
              path: "*", // Catch-all route for non-existent paths
              element: <ErrorPage />,
            }
          ]
        }
      ]
    },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
