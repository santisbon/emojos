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

  let instancev1 = await getInstance(server.id, "v1");
  let instancev2 = await getInstance(server.id);
  
  server.avatar = instancev1?.thumbnail ?? null;
  server.software = instancev2?.source_url ?? null;
  server.version = instancev1?.version ?? null;
  //server.users = null;
  server.users = instancev1?.stats?.user_count ?? null;
  server.mau = instancev2?.usage?.users?.active_month ?? null;
  server.registrationsEnabled = instancev1?.registrations ?? null;
  server.approvalRequired = instancev1?.approval_required ?? null;
  // Akkoma max chars is in instance v1 with a different name, not in nodeinfo
  server.maxchars = (instancev1?.configuration?.statuses?.max_characters ?? instancev1?.max_toot_chars) ?? null;
  server.translation = instancev2?.configuration?.translation?.enabled ?? null;
  server.description = (instancev1?.description ? instancev1.description : instancev1?.short_description) ?? null;

  let nodeInfo;

  if (!instancev2) { 
    // Mastodon and Friendica don't allow cross-origin on the `nodeinfo` API (bug) 
    // so we only call it on servers without an instance v2 API.

    // Firefish.social and Fedibird don't have a working instance API, so we use nodeinfo.
    
    nodeInfo = await getNodeInfo(server.id);
    let repo = nodeInfo?.software?.repository ?? nodeInfo?.metadata?.repositoryUrl;
    
    server.software = server.software ?? nodeInfo?.software?.name + (repo ? " from " + repo : "");
    server.version = server.version ?? nodeInfo?.software?.version;
    //server.description = nodeInfo?.metadata?.nodeDescription;
    server.mau = (server.mau ?? nodeInfo?.usage?.users?.activeMonth) ?? null;
    server.maxchars = (server.maxchars ?? nodeInfo?.metadata?.maxNoteTextLength) ?? null;
    //server.translation = null;
    server.registrationsEnabled = server.registrationsEnabled ?? nodeInfo?.openRegistrations;
    //server.approvalRequired = null;
    server.users = server.users ?? nodeInfo?.usage?.users?.total;
    
    console.log(nodeInfo?.software?.name);

    switch (nodeInfo?.software?.name) {
      case 'firefish':
        // Firefish and Iceshrimp have a blank image as avatar so we're not using it
        //server.avatar = instancev1?.uri + server.avatar ?? '/img/firefish.png';
        server.avatar = '/img/firefish.png';
        break;
      case 'iceshrimp':
        server.avatar = '/img/iceshrimp.ico';
        break;
      case 'pleroma':
        server.mau = instancev1?.pleroma?.stats?.mau;
        break;
      case 'fedibird':
        server.avatar = server.avatar ?? 'https://joinfediverse.wiki/images/7/7c/Fedibird.svg'
      case 'lemmy':
        server.avatar = server.avatar ?? 'https://joinfediverse.wiki/images/5/50/Lemmy.svg'
      case 'pixelfed':
        server.avatar = server.avatar ?? 'https://joinfediverse.wiki/images/c/c6/Pixelfed.svg'
      case 'wordpress':
        server.avatar = server.avatar ?? 'https://joinfediverse.wiki/images/a/ae/WordPress.svg'
      case 'peertube':
        server.avatar = server.avatar ?? 'https://joinfediverse.wiki/images/7/7c/PeerTube_logo.svg'
      default:
        server.avatar = server.avatar ?? 'https://joinfediverse.wiki/images/4/40/Fediverse.svg';
    }
  } 

  let maupct = server.mau/server.users;
  server.maupct = maupct ? Number(maupct).toLocaleString(new Intl.NumberFormat(), {style: 'percent', minimumFractionDigits:2}) : null;
  
  // No public CORS-enabled emoji API:
  // Misskey, Lemmy, Pixelfed, Kbin, WordPress, Plume, Peertube, WriteFreely, Bookwyrm, Hubzilla, GotoSocial, GNUSocial, Owncast
  
  let emojos; 
  try {
    emojos = await getGroupedData('https://' + server.id + "/api/v1/custom_emojis" , "category");
    server.emojos = emojos;
  } catch (error) {
    console.log("Error getting custom emojis");
    console.log(error);
    
    server.emojos = null;
  }
  
  //console.log(instancev1, instancev2, nodeInfo, emojos);

  if (!instancev1 && !instancev2 && !nodeInfo && !emojos) {
    throw new Error("Server is not valid or has a misconfigured CORS policy preventing browsers from accessing its APIs.");
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
  let nodeInfoLink;

  try {
    // ``);
    response = await axios.get('https://' + domain.trim() + `/.well-known/nodeinfo`, {
      timeout: 2000
    });
    let links = response?.data.links ?? null;
    if (links) {
      nodeInfoLink = links[links.length -1].href;
    }

    response = await axios.get(nodeInfoLink, {
      timeout: 2000
    });
  } catch (error) {
    console.log("Error getting node info");
    console.log(error);
    response = null;
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
    console.log("Error getting instance " + `${version}` + ` for ${domain.trim()}`);
    console.log(error);
  }

  return response?.data ?? null;
}
