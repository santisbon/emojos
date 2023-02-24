import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getServers(query) {
  let servers = await localforage.getItem("servers");
  if (!servers) servers = [];
  if (query) {
    servers = matchSorter(servers, query, { keys: ["id", "domain", "title"] });
  }
  return servers.sort(sortBy("domain", "createdAt"));
}

export async function createServer(id) {
  if (!id) {
    id = Math.random().toString(36).substring(2, 9);
  }

  let server = { id, createdAt: Date.now() };
  let servers = await getServers();
  servers.unshift(server);
  await set(servers);
  return server;
}

export async function getServer(id) {
  let servers = await localforage.getItem("servers");
  let server = servers.find(server => server.id === id);
  return server ?? null;
}

export async function updateServer(id, updates) {
  let servers = await localforage.getItem("servers");
  let server = servers.find(server => server.id === id);
  if (!server) throw new Error("No server found for", id);
  Object.assign(server, updates);
  await set(servers);
  return server;
}

export async function deleteServer(id) {
  let servers = await localforage.getItem("servers");
  let index = servers.findIndex(server => server.id === id);
  if (index > -1) {
    servers.splice(index, 1);
    await set(servers);
    return true;
  }
  return false;
}

function set(servers) {
  return localforage.setItem("servers", servers);
}

//-----------------------------------------------------------------------------

export function copyEmojo(shortcode) {
  navigator.clipboard.writeText(':'+ shortcode +':');
  var item = document.getElementById(shortcode);
  item.innerHTML = 'Copied!';
  setTimeout(() => {item.innerHTML = ':'+shortcode+':'}, 1200);
}

export function updateSourceMedia(colorPreference) {
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

export const getGroupedData = async (url, group) => {
  const axios = window.axios;
  const response = await axios.get(url);
  return groupBy(response.data, group);
};

/**
 * Group an array by a key.
 * @param {Array} data array of objects
 * @param {string} key the key to group by
 * @returns {any} the grouped data 
 */
function groupBy(data, key) { 
  // `.reduce` takes in a function to call for each element in the array and an initial value to start the accumulation
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