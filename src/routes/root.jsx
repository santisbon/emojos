import { Outlet, NavLink, Link, useLoaderData, Form, redirect, useNavigation, useSubmit,} from "react-router-dom";
import { useEffect } from "react";
import { getServers, createServer } from "../servers";


/*
Creating data
Export an `action` in the root route, wire it up to the route config in main.jsx,
and use a React Router `<Form>` to post the form data to the route `action`.
*/

export async function action({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const server = await createServer(data.serverId.trim());
    document.getElementById("serverId").value = "";
    return redirect(`/servers/${server.id}`);
  } catch (error) {
    alert(error);
    return null;
  }
  
}

/* 
Loading data
Export a `loader` function in the root module, then we'll hook it up to the route on main.jsx.
Then we can access and render the data with in root.jsx with `useLoaderData`.
*/

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const servers = await getServers(q);
  return { servers, q };
}

export default function Root() {
  const { servers, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  /* 
  Add some immediate UI feedback for the search. For this we'll use `useNavigation`. 
  The `navigation.location` will show up when the app is navigating to a new URL and loading the data for it. 
  It then goes away when there is no pending navigation anymore.
  */

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  // Synchronize input value with the URL Search Params so that clicking the back button will update the input
  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);
  
  /*  
  The React Router <Form> prevents the browser from sending the request to the server 
  and sends it to your route action instead.

  React Router uses POST as a hint to automatically revalidate the data on the page after the action finishes. 
  That means all of your useLoaderData hooks update and the UI stays in sync with your data automatically.
   
  For the component to return multiple elements (like sidebar and detail) you can use Fragments.
  They let you group a list of children without adding extra nodes to the DOM.
  The short syntax to declare them looks like empty tags: `<></>`.

  Because the search form is a GET, not a POST, React Router does not call the action. 
  Submitting a GET form is the same as clicking a link: only the URL changes. 
  That's why the code we added for filtering is in the loader, not the action of this route.

  Now that the form is submitted for every key stroke, if we type the characters "seba" and then delete them with backspace, 
  we end up with 7 new entries in the stack. We don't want this.
  We avoid this by replacing the current entry in the history stack with the next page, instead of pushing into it.
  Use `replace` in `submit`.
  We only want to replace search results, not the page before we started searching, 
  so we do a quick check if this is the first search or not and then decide to replace.
  Each key stroke no longer creates new entries, so the user can click back out of the search results 
  without having to click it 7 times.

  The form with then New button is a POST so React Router will call the route `action`.

  To make it clear which record from the sidebar we're looking at, use `NavLink`.
  Pass the `className` a function. When the user is at the URL in the `NavLink`, then `isActive` will be true. 
  When it's about to be active (the data is still loading) then `isPending` will be true. 
  This allows us to easily indicate where the user is, as well as provide immediate feedback on links that 
  have been clicked but we're still waiting for data to load.

  Global Pending UI
  As the user navigates the app, React Router will leave the old page up as data is loading for the next page.
  Let's provide the user with some feedback so the app doesn't feel unresponsive.
  React Router is managing all of the state behind the scenes and reveals the pieces of it you need to build dynamic web apps. 
  The `useNavigation` hook returns the current navigation state: it can be one of `"idle" | "submitting" | "loading"`.
  Add a `"loading"` class to the main part of the app if we're not idle. 
  The CSS then adds a nice fade after a short delay (to avoid flickering the UI for fast loads). 
  You could do anything you want though, like show a spinner or loading bar across the top.

  We need to tell the root route where we want it to render its child routes. We do that with `<Outlet>`.
  */

  return (
    <>
      <div id="sidebar">
        <h1>My server catalog</h1>
        <div>
          <Form method="post">
            <input 
              id="serverId"
              name="serverId"
              aria-label="Add server"
              placeholder="mastodon.social"
              size="13"
              required
            /> 
            <button type="submit">Add</button>
          </Form>  
        </div>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search servers"
              placeholder="Search"
              type="search"
              name="q"
              size="11"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
        </div>
        <nav>
          {servers.length ? (
            <ul>
              {servers.map((server) => (
                <li key={server.id}>
                  <NavLink
                    to={`servers/${server.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }
                  >
                    {server.id ? (
                      <>
                        {server.id}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {server.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No servers</i>
            </p>
          )}
        </nav>
        <div>
          <picture>
            <source srcSet='/github-mark-white.svg' media='(prefers-color-scheme: dark)' />
            <img src='/github-mark.svg' className='footer-item' alt='GitHub' />
          </picture>
          <a href='https://github.com/santisbon/emojos' target='_blank' rel='noopener noreferrer'>GitHub</a> 
          |
          <picture>
            <source srcSet='/logo-white.svg' media='(prefers-color-scheme: dark)' />
            <img src='/logo-black.svg' className='footer-item' alt='Mastodon' />
          </picture>
          <a rel="me" href="https://universeodon.com/@santisbon">Mastodon</a>
        </div>
      </div>
      <div 
        id="detail"
        className={
          navigation.state === "loading" ? "loading" : ""
        }
      >
        <Outlet />
      </div>
    </>
  );
}