import { Form, useLoaderData, useFetcher, } from "react-router-dom";
import { getServer, updateServer } from "../servers";

export async function loader({ params }) {
  const server = await getServer(params.serverId);
  if (!server) {
    throw new Response("", {
      status: 404,
      statusText: `Server not found in your catalog. Please add ${params.serverId} with the "Add" button.`,
    });
  }
  return server;
}

export async function action({ request, params }) {
  let formData = await request.formData();
  return updateServer(params.serverId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Server() {
  const server = useLoaderData();

  return (
    <div id="server">
      <div>
        <img
          key={server.avatar}
          src={server.avatar || null}
        />
      </div>

      <div>
        <h1>
          {server.domain ? (
            <>
              <a href={`https://${server.domain}`} target='_blank' rel='noopener noreferrer'>{server.domain}</a>
            </>
          ) : (
            <i>No Domain</i>
          )}{" "}
          <Favorite server={server} />
        </h1>

        <p>
          Version: {server.version}<br/>
          Monthly active users: {server.mau}<br/>
          Max characters per post: {server.maxchars}<br/>
          Translation enabled: {server.translation.toString()}
        </p>
        {server.description && (<p>{server.description}</p>)}
        
        {server.notes && <p>{server.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ server }) {
  /*
  The useFetcher hook allows us to communicate with loaders and actions 
  without causing a navigation (creating new entries in the history stack).
  */
  const fetcher = useFetcher();
  let favorite = server.favorite;

  /*
  If you click the button you should see the star immediately change to the new state. 
  Instead of always rendering the actual data, we check if the fetcher has any formData being submitted. 
  If so, we'll use that instead. 
  When the action is done, the fetcher.formData will no longer exist and we're back to using the actual data. 
  So even if you write bugs in your optimistic UI code, it'll eventually go back to the correct state.
  */
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }

  /*
  Since it's got method="post" it will call the action.
  Since there is no <fetcher.Form action="..."> prop, it will post to the route where the form is rendered.
  */
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}