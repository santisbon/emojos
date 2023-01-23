import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Search(props) {
  return (
    <div>
      <label htmlFor='serverInput'>Server: </label>&nbsp;
      <input id='serverInput' onChange={props.onChange} value={props.server} placeholder='mastodon.social'></input>&nbsp;
      <button onClick={props.onClick} disabled={props.server === ''}>Get emojos</button>
      <p/>
        <picture>
          <source srcSet='/github-mark-white.png' media='(prefers-color-scheme: dark)' />
          <img src='/github-mark.png' className='grid-item' alt='gh' />
        </picture>
        &nbsp;
        <a href='https://github.com/santisbon/emojos' target='_blank' rel='noopener noreferrer'>GitHub</a> 
        &nbsp; | &nbsp;
        <a href='https://instances.social/list/advanced#lang=&allowed=&prohibited=&min-users=20000&max-users=' target='_blank' rel='noopener noreferrer'>Need help finding an instance?</a>
      <p/>
      <label>{props.message}</label>
    </div>
  );
}

function Grid(props) {
  if(props) {
    return (
      <div>
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
                <img className='grid-item' src={element.url} alt={element.shortcode} />&nbsp;
                <span id={element.shortcode}>:{element.shortcode}:</span>
              </dd>);
          })}
        </div>
      </div>
    );
  }
}

function EmojosApp() {
  const [server, setServer] = useState('');
  const [emojos, setEmojos] = useState({});
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const toggle = document.querySelector('dark-mode-toggle');
    document.firstElementChild.setAttribute('data-theme', toggle.mode)

    toggle.addEventListener('colorschemechange', () => {
      document.firstElementChild.setAttribute(
        'data-theme',
        toggle.mode
      )
      updateSourceMedia(toggle.mode)
    })
  });

  // Search button click
  function handleClick(e) {
    getGroupedData('https://' + server + '/api/v1/custom_emojis', 'category').then((groupedEmojos)=>{
      setEmojos(groupedEmojos);
      setMessage('Click/tap to copy');
    }).catch(error => {
      console.log(error);
      setMessage(error.message);
      setEmojos({});
    });
  }

  // Search input text change
  function handleChange(e) {
    setServer(e.target.value);
  }

  return (
    <div>
      <aside>
        <dark-mode-toggle appearance="switch" light="Day&nbsp;&nbsp;&nbsp;&nbsp;" dark="Night"></dark-mode-toggle>
      </aside>
      <main>
        <div><h3>Get the custom emojis (emojos) for a Mastodon server</h3></div>
        <p>
        </p>
        <Search onChange={handleChange} onClick={handleClick} server={server} message={message} />
        <dl>
          {Object.entries(emojos).map(pair => {return (<Grid key={pair[0]} category={pair[0]} elements={pair[1]} />);})}
        </dl>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<EmojosApp />);

const getGroupedData = async (url, group) => {
  const axios = window.axios;
  const response = await axios.get(url);
  return groupBy(response.data, group);
}; 

function groupBy(data, key) { // `data` is an array of objects, `key` is the key to group by
  // .reduce takes in a function and an initial value
  return data.reduce((accumulator, currentValue) => {
    var group = currentValue[key];
    // initialize the accumulator for this group if empty
    accumulator[group] = accumulator[group] || [];
    // add this currentValue to its group within the accumulator
    accumulator[group].push(currentValue);
    // return the updated accumulator to the reduce function for the next iteration 
    return accumulator; 
  }, {}); // {} is the initial value of the accumulator
};

function copyEmojo(shortcode) {
  navigator.clipboard.writeText(':'+ shortcode +':');
  var item = document.getElementById(shortcode);
  item.innerHTML = 'Copied!';
  setTimeout(() => {item.innerHTML = ':'+shortcode+':'}, 1200);
}

function updateSourceMedia(colorPreference) {
  const pictures = document.querySelectorAll('picture');
  pictures.forEach(picture => {
    // sources is a NodeListOf<HTMLSourceElement>
    const sources = picture.querySelectorAll(`
      source[media*="prefers-color-scheme"], 
      source[data-media*="prefers-color-scheme"]
    `);

    sources.forEach(source => {
      // Preserve the source `media` as a data-attribute
      // to be able to switch between preferences
      if (source?.media.includes('prefers-color-scheme')) {
        source.dataset.media = source.media
      }
      // If the source element `media` target is the `preference`,
      // override it to 'all' to show
      // or set it to 'none' to hide
      if (source?.dataset.media.includes(colorPreference)) {
        source.media = 'all'
      } else if (source) {
        source.media = 'none'
      }
    });
  });
}
