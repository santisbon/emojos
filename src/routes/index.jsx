export default function Index() {
  return (
    <>
      <h2 className="zero-state"><a href='https://symbol.fediverse.info' target='_blank' rel='noopener noreferrer'>⁂</a> Fediverse Server Viewer</h2>
      <h3 className="zero-state">Features</h3>
      <ul className="zero-state">
        <li>Keep a list of Fediverse servers and view their custom emojis and other features like character limit and translation availability. </li>
        <li>Click/tap to copy emojis.</li>
        <li>Searching your list looks in the server name and any personal notes you add to it.</li>
        <li>Tip: You can search for your favorites by typing "favorite".</li>
        <li>Install as an app on desktop and mobile for <a href="https://web.dev/learn/pwa/progressive-web-apps/#compatibility" target='_blank' rel='noopener noreferrer'>browsers that support it</a>.</li>
        <li>Shareable URLs.</li>
        <li>Tested on Akkoma, Bookwyrm, Cherrypick, Fedibird, Firefish, Foundkey, Friendica, GNUSocial, GotoSocial, Hometown, Hubzilla, Iceshrimp, Kbin, Lemmy, Mastodon, Microdotblog, Misskey, Mobilizon, Owncast, Peertube, Pixelfed, Pleroma, Plume, Takahē, WordPress.</li>
      </ul>
      <p className="zero-state">
        Don't know what servers to add to your  list? You can find them on
          <a href='https://fedidb.org/network'
          target='_blank' rel='noopener noreferrer'> fedidb.org</a> or on
          <a href='https://instances.social/list/advanced#lang=&allowed=&prohibited=&min-users=20000&max-users=' 
          target='_blank' rel='noopener noreferrer'> instances.social</a>.
      </p>
    </>
  );
}