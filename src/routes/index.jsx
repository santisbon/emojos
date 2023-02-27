export default function Index() {
  return (
    <>
      <p className="zero-state">
        Keep a list of Mastodon servers and view their custom emojis and other features like character limit 
        and translation.
      </p>
      <ul className="zero-state">
        <li>Add servers to your list.</li>
        <li>Hit ☆ to mark as a favorite.</li>
        <li>You can edit to add a note to any server on your list.</li>
        <li>Searching your list looks in the server name, its favorite status, and your personal notes.</li>
      </ul>
      <label className="zero-state">Tip:</label>
      <ul className="zero-state">
      <li>You can search for your favorites by typing "true".</li>
      </ul>
      <p>
        <a href='https://instances.social/list/advanced#lang=&allowed=&prohibited=&min-users=20000&max-users=' 
        target='_blank' rel='noopener noreferrer'
        className="zero-state">Help me find a server</a>.
      </p>
    </>
  );
}