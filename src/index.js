import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Search(props) {
  return (
    <section>
      <label htmlFor='serverInput'>Server: </label>&nbsp;
      <input id='serverInput' onChange={props.onChange} value={props.server} placeholder='mastodon.social' size='15'></input>&nbsp;
      <button type='button' onClick={props.onClick} disabled={props.server === ''}>Get</button>
      <p/>
      <a href='https://instances.social/list/advanced#lang=&allowed=&prohibited=&min-users=20000&max-users=' target='_blank' rel='noopener noreferrer'>Help me find a server</a>
      <p/>
      <picture>
        <source srcSet='/github-mark-white.svg' media='(prefers-color-scheme: dark)' />
        <img src='/github-mark.svg' className='grid-item' alt='GitHub' />
      </picture>&nbsp;
      <a href='https://github.com/santisbon/emojos' target='_blank' rel='noopener noreferrer'>GitHub</a> 
      &nbsp; | &nbsp;
      <picture>
        <source srcSet='/logo-white.svg' media='(prefers-color-scheme: dark)' />
        <img src='/logo-black.svg' className='grid-item' alt='Mastodon' />
      </picture>&nbsp;
      <a rel="me" href="https://mastodon.social/@santisbon">Mastodon</a>
      <p/>
      <label>{props.message}</label>
    </section>
  );
}

function Results(props) {
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
                <img className='grid-item' src={element.url} alt={element.shortcode} />&nbsp;
                <span id={element.shortcode}>:{element.shortcode}:</span>
              </dd>);
          })}
        </div>
      </section>
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
    <main>
      <section>
        <dark-mode-toggle appearance="switch" light="Day&nbsp;&nbsp;&nbsp;&nbsp;" dark="Night"></dark-mode-toggle>
      </section>
      <section className='center'>
        <div><h3>Mastodon custom emojis (emojos)</h3></div>
        <p>
        </p>
        <Search onChange={handleChange} onClick={handleClick} server={server} message={message} />
      </section>
      <section>
        <dl>
          {Object.entries(emojos).map(pair => {return (<Results key={pair[0]} category={pair[0]} elements={pair[1]} />);})}
        </dl>
      </section>
    </main>
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
      // Preserve the source `media` query as a data-attribute
      // to be able to switch between preferences
      if (source?.media.includes('prefers-color-scheme')) {
        source.dataset.media = source.media
      }
      // If the source element `media` query target is the `preference`,
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
