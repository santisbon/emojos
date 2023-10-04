export default function Index() {
  return (
    <>
      <h3 className="zero-state">Features</h3>
      <ul className="zero-state">
        <li>Keep a list of Fediverse servers and view their custom emojis (where available) and other features like character limit and translation. </li>
        <li>Click/tap to copy emojis.</li>
        <li>Curently supports Mastodon, Firefish, Iceshrimp, Pleroma, Akkoma, Friendica, Takahē, Fedibird, Lemmy, Pixelfed, WordPress, Peertube, GotoSocial, GNUSocial.</li>
        <li>Searching your list looks in the server name and any personal notes you add to it.</li>
        <li>Tip: You can search for your favorites by typing "favorite".</li>
        <li>Install as an app on desktop and mobile for <a href="https://web.dev/learn/pwa/progressive-web-apps/#compatibility" target='_blank' rel='noopener noreferrer'>browsers that support it</a>.</li>
        <li>Shareable URLs.</li>
      </ul>
      <p className="zero-state">
        You can look up a server on
          <a href='https://instances.social/list/advanced#lang=&allowed=&prohibited=&min-users=20000&max-users=' 
          target='_blank' rel='noopener noreferrer'> instances.social</a> or on
          <a href='https://fedidb.org/network'
          target='_blank' rel='noopener noreferrer'> fedidb.org</a>.
      </p>
    </>
  );
}