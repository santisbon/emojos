import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
//import axios from 'axios';
import './index.css';

// We don't import axios as a node module, we use it from a CDN

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
  const [prefersDarkScheme, setPrefersDarkScheme] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

  function toggleTheme() {
    if (prefersDarkScheme) {
      document.body.classList.toggle("light-theme");
    } else {
      document.body.classList.toggle("dark-theme");
    }
  }

  useEffect(() => {
    
  });

  // Search click
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

  // Search change
  function handleChange(e) {
    setServer(e.target.value);
  }

  if(emojos) {
    return (
      <div>
        <div><h3>Get the custom emojis (emojos) for a Mastodon server</h3></div>
        <p>
        <button onClick={toggleTheme}>Light / Dark</button>
        </p>
        <Search onChange={handleChange} onClick={handleClick} server={server} message={message} />
        <dl>
          {Object.entries(emojos).map(pair => {return (<Grid key={pair[0]} category={pair[0]} elements={pair[1]} />);})}
        </dl>
      </div>
    );
  }
  else {
    return (<Search onChange={handleChange} onClick={handleClick} />);
  }
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