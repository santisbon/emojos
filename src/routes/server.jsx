import { Form, useLoaderData, useFetcher, } from "react-router-dom";
import { getServer, updateServer, copyEmojo } from "../servers";
import { closeNav, openNav } from "../nav";

export async function loader({ params }) {
  const server = await getServer(params.serverId);
  if (!server) {
    throw new Response("", {
      status: 404,
      statusText: `Server not found.`,
    });
  }
  return server;
}

export async function action({ request, params }) {
  let formData = await request.formData();
  return updateServer(params.serverId, {
    favorite: formData.get("favorite") === "true",
    favoriteSearch: formData.get("favorite") === "true" ? "favorite" : null
  });
}

export default function Server() {
  const server = useLoaderData();

  return (
    <>
      {
        !server.saved ? (
          <>
            <div id="server-avatar" onLoad={closeNav}>
              <img hidden
                  key={null}
                  src="/img/logo-white.svg"
              />
            </div>
          </>
        ):(
          <>
          </>
        )
      }
      {
        server.version ? (
        <>
          <div id="server-avatar">
            <img
              key={server.avatar}
              src={server.avatar || null}
            />
          </div>
        </>) : (
        <>
        </>)
      }
      <div id="server">
        <div>
          <h1>
            {server.domain ? (
              <>
                <a href={`https://${server.domain}`} target='_blank' rel='noopener noreferrer'>{server.domain}</a>
              </>
            ) : (
              <i>No Domain</i>
            )}{" "}
            {server.saved ? (<Favorite server={server} />) : ""}
          </h1>
          
          {
            server.version ? (
              <>
                <p>
                  Version: {server.version}<br/>
                  Users: {new Intl.NumberFormat().format(server.users)}<br />
                  Monthly active users: {new Intl.NumberFormat().format(server.mau)}<br/>
                  Registrations open: {server.registrationsEnabled ? "Yes" : "No"}<br/>
                  Approval required: {server.approvalRequired ? "Yes" : "No"} <br />
                  Character limit: {new Intl.NumberFormat().format(server.maxchars)}<br/>
                  Translation: {server.translation ? "Yes": "N/A"}
                </p>
              </>
            ) : (
              <></>
            )
          }

          {server.description && (<p>{server.description}</p>)}          
          {server.notes && <p>My notes: {server.notes}</p>}
          <div>
            {server.saved ? (
              <>
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
              </>
            ) : (
              <>
                <Form
                  method="post"
                  action="create"
                >
                  <button type="submit" onClick={openNav}>Add</button>
                </Form>
              </>
            )
            }
          </div>
        </div>
      </div>
      <div>
        {
          server.emojos ? (
            <>
            <h2>Custom Emojis</h2>
            <dl>
              {Object.entries(server.emojos).map(pair => {return (<Emojos key={pair[0]} category={pair[0]} elements={pair[1]} />);})}
            </dl>
            </>
          ) : (<></>)
        }
      </div>
    </>
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

function Emojos(props) {
  if(props) {
    return (
      <section>
        <div>
          <dt>
            <h4>
            {props.category === 'undefined' ? 'No category' : props.category }
            </h4>
          </dt>
        </div>
        <div className='grid-container'>
          {props.elements.map(element => {
            return (<dd key={element.shortcode} onClick={() => {copyEmojo(element.shortcode)}}>
                <img className='grid-item' src={element.url} alt={element.shortcode} />
                <span id={element.shortcode}>:{element.shortcode}:</span>
              </dd>);
          })}
        </div>
      </section>
    );
  }
}