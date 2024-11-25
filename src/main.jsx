import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import './index.css'

import Root from "./routes/root";
import Index from './routes/index_new';
import AdvancedSearch, { action as advancedSearchAction } from './routes/advanced-search';
import ErrorPage from "./routes/error-page";
import Results from "./routes/results";


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
              element: <AdvancedSearch />,
              action: advancedSearchAction  // TODO
            },
            {
              path: "results",
              element: <Results />
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
