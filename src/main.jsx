import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import './index.css'

import Root from "./routes/root";
import Index from './routes/index';
import AdvancedSearch from './routes/advanced-search';
import ErrorPage from "./routes/error-page";
import Results from "./routes/results";
import { SingleCard, loader as cardLoader } from './routes/singlecard';
import Test from './routes/test';
import { CardGallery, loader as galleryLoader } from './routes/card-gallery';


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
              path: "test",
              element: <Test />
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


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
