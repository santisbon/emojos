export default function Index() {
  return (
    <>
      <p className="zero-state">
        Keep a list of Mastodon servers and view their custom emojis and other features like character limit 
        and translation.
      </p>
      <p className="zero-state">
        Searching your list looks in the server name and any personal notes you add to it. 
        Tip: You can search for your favorites by typing "favorite".
      </p>
      <p>
        <a href='https://instances.social/list/advanced#lang=&allowed=&prohibited=&min-users=20000&max-users=' 
        target='_blank' rel='noopener noreferrer'
        className="zero-state">Help me find a server</a>.
      </p>
    </>
  );
}