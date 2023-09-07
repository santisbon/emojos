export default function Index() {
  return (
    <>
      <p className="zero-state">
        Keep a list of Fediverse servers and view their custom emojis and other features like character limit 
        and translation when available. Curently supports Mastodon, Firefish, Pleroma, Iceshrimp, Friendica, Takahē, and Fedibird.
        <br></br>You can find a server on
      <a href='https://instances.social/list/advanced#lang=&allowed=&prohibited=&min-users=20000&max-users=' 
      target='_blank' rel='noopener noreferrer'
      className="zero-state"> instances.social</a> or on
      <a href='https://fedidb.org/network'
      target='_blank' rel='noopener noreferrer'
      className="zero-state"> fedidb.org</a>.
      </p>
      <p className="zero-state">
        Searching your list looks in the server name and any personal notes you add to it. 
        Tip: You can search for your favorites by typing "favorite".
      </p>
      <p>
      <table className="center">
        <tr>
          <a href='https://ko-fi.com/E1E2OOCOY' target='_blank' rel='noopener noreferrer'>
            <img height='36' className='ko-fi-logo' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' />
          </a>
        </tr>
        <tr>
          <a href="https://account.venmo.com/u/Armando-Santisbon" target='_blank' rel='noopener noreferrer'> 
              <img src='/img/venmo.svg' className='venmo-logo' alt='venmo'></img>
          </a>
        </tr>
      </table>
      </p>
    </>
  );
}