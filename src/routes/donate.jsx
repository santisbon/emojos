export default function Donate() {
  return (
    <>
      <p className="zero-state">
        If you find this app useful you can make a donation on your preferred platform. Thank you!
      </p>
      <p></p>
      <table>
        <tbody>
          <tr>
            <td>Ko-fi</td>
            <td className="center">
              <a href='https://ko-fi.com/E1E2OOCOY' target='_blank' rel='noopener noreferrer'>
                <img height='36' className='ko-fi-logo' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' />
              </a>
            </td>
          </tr>
          <tr>
            <td>Venmo</td>
            <td className="center">
              <a href="https://account.venmo.com/u/Armando-Santisbon" target='_blank' rel='noopener noreferrer'> 
                  <img src='/img/venmo.svg' className='venmo-logo' alt='venmo'></img>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}