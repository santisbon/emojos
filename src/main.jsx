import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route} from "react-router-dom";
import './index.css'
import Root, { loader as rootLoader, action as rootAction, } from "./routes/root";
import Index from "./routes/index";
import EditServer, { action as editAction, } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import { action as createAction } from "./routes/create";
import ErrorPage from "./error-page";
import Server, { loader as serverLoader, action as serverAction, } from "./routes/server";
import Donate from './routes/donate';

/* 
Pathless route
Wrap the child routes in a pathless route.
When any errors are thrown in the child routes, our new pathless route will catch it and render, preserving the root route's UI.

Index routes
When a route has children and you're at the parent route's path, the <Outlet> has nothing to render because no children match. 
You can think of index routes as the default child route to fill in that space.
*/

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root />}
      loader={rootLoader}
      action={rootAction}
      errorElement={<ErrorPage />}
    >
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Index />} />
        <Route 
          path='/donate'
          element={<Donate />}
        />
        <Route
          path=":serverId"
          element={<Server />}
          loader={serverLoader}
          action={serverAction}
        />
        <Route
          path=":serverId/edit"
          element={<EditServer />}
          loader={serverLoader}
          action={editAction}
        />
        <Route
          path=":serverId/destroy"
          action={destroyAction}
        />
        <Route
          path=":serverId/create"
          action={createAction}
        />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
