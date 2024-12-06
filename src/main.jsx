import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import './index.css'

import Root from "./routes/root";
import Index from './routes/index_new';
import AdvancedSearch from './routes/advanced-search';
import ErrorPage from "./routes/error-page";
import Results from "./routes/results";
import SingleCard, { loader as cardLoader } from './routes/singlecard';
import Test from './routes/test';


const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          errorElement: <ErrorPage />,
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
              path: "*",
              element: <ErrorPage />
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
