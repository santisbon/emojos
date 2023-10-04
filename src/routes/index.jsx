export default function Index() {
  return (
    <>
      <p className="zero-state">
        Keep a list of Fediverse servers and view their custom emojis (where available) and other features like character limit 
        and translation. 
        <br></br>Curently supports Mastodon, Firefish, Iceshrimp, Pleroma, Akkoma, Friendica, Takahē, Fedibird, Lemmy, Pixelfed, WordPress, Peertube, GotoSocial, GNUSocial.
        <br></br>You can find a server on
      <a href='https://instances.social/list/advanced#lang=&allowed=&prohibited=&min-users=20000&max-users=' 
      target='_blank' rel='noopener noreferrer'
      className="zero-state"> instances.social</a> or on
      <a href='https://fedidb.org/network'
      target='_blank' rel='noopener noreferrer'
      className="zero-state"> fedidb.org</a>.
      </p>
      <p className="zero-state">
        Searching your list looks in the server name and any personal notes you add to it. <br></br>
        Tip: You can search for your favorites by typing "favorite".
      </p>
    </>
  );
}