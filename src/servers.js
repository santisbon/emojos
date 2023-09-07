import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getServers(query) {
  let servers = await localforage.getItem("servers");
  if (!servers) servers = [];
  if (query) {
    servers = matchSorter(servers, query, { keys: ["id", "notes", "favoriteSearch"] });
  }
  return servers.sort(sortBy("id", "createdAt"));
}

export async function createServer(id) {
  if (!id) {
    //id = Math.random().toString(36).substring(2, 9);
    throw new Error("Server id must be provided.");
  }

  let server = await getServer(id);

  if (server?.saved) {
    throw new Error("Server already added to list.");
  }

  server = { id, createdAt: Date.now() };
  let servers = await getServers();
  servers.unshift(server);
  await set(servers);
  return server;
}

export async function getServer(id) {
  let servers = await localforage.getItem("servers");
  if (!servers) {
    servers = [];
    await set(servers);
  } 

  let server = servers.find(server => server.id === id);
  
  if (server) {
    server.saved = true;
  } else {
    server = {
      id: id,
      saved: false
    }
  }

  server.domain = id;

  let instance = await getInstance(server.id);
  
  server.avatar = instance?.thumbnail?.url ?? null;
  server.version = instance?.version ?? null;
  server.description = instance?.description ?? null;
  server.mau = instance?.usage?.users?.active_month ?? null;
  server.maxchars = instance?.configuration?.statuses?.max_characters ?? null;
  server.translation = instance?.configuration?.translation?.enabled ?? null;
  server.registrationsEnabled = instance?.registrations?.enabled ?? null;
  server.approvalRequired = instance?.registrations?.approval_required ?? null;
  server.users = null;
  
  if (instance) {
    // Mastodon has an instance API. Firefish doesn't, at least not a working one at the moment.
    let instancev1 = await getInstance(server.id, "v1");
    server.users = instancev1?.stats?.user_count
  }
  else {
    // Mastodon doesn't allow cross-origin on the `nodeinfo` API (bug) so we only use it on servers without an instance API
    let nodeInfo = await getNodeInfo(server.id);

    server.version = nodeInfo?.software?.version;
    server.description = nodeInfo?.metadata?.nodeDescription;
    server.mau = nodeInfo?.usage?.users?.activeMonth;
    server.maxchars = nodeInfo?.metadata?.maxNoteTextLength;
    server.translation = null;
    server.registrationsEnabled = nodeInfo?.openRegistrations;
    server.approvalRequired = null;
    server.users = nodeInfo?.usage?.users?.total;

    server.software = nodeInfo?.software?.name;

    // Firefish errors out on the instance API and the nodeinfo API doesn't include a logo
    switch (server.software) {
      case 'firefish':
        server.avatar = '/img/firefish.png';
        break;
      case 'iceshrimp':
        server.avatar = '/img/iceshrimp.ico';
        break;
      default:
        //server.avatar = '/img/Fediverse_logo_proposal.svg';
        server.avatar = '/img/Fediverse_logo_proposal_(mono_version).svg';
    }
  } 

  // These implement the Mastodon custom_emojis API:
  // Mastodon, Firefish, Pleroma, Friendica, Takahē, Fedibird.

  // These do NOT:
  // Akkoma, Misskey, Lemmy, Pixelfed, Kbin, WordPress, Plume, Peertube, WriteFreely, Bookwyrm, Hubzilla, GotoSocial, GNUSocial, Owncast
  
  let emojos; 
  try {
    emojos = await getGroupedData('https://' + server.id + "/api/v1/custom_emojis" , "category");
    server.emojos = emojos;
  } catch (error) {
    console.debug(error);
    //server.emojos = null;
    throw new Error("Server is not valid.");
  }
  
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

const getGroupedData = async (url, group) => {
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

async function getNodeInfo(domain) {
  const axios = window.axios;
  let response;

  try {
    // `/.well-known/nodeinfo`);
    response = await axios.get('https://' + domain.trim() + `/nodeinfo/2.0`, {
      timeout: 2000
    });
  } catch (error) {
    console.debug(error)
  }

  return response?.data ?? null;
}

async function getInstance(domain, version = "v2") {
  const axios = window.axios;
  let response;
  try {
    response = await axios.get('https://' + domain.trim() + `/api/${version}/instance`, {
      timeout: 2000
    });
  } catch (error) {
    console.debug(error);
  }

  return response?.data ?? null;
}
