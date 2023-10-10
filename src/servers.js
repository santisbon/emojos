import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

/**
 * Get saved server list
 * @param {string} query 
 * @returns 
 */
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
  let instancev1 = await getInstance(server.id, 'v1');
  
  server.avatar = instancev1?.thumbnail ?? null;
  server.approvalRequired = instancev1?.approval_required ?? null;
  // Akkoma max chars is in instance v1 with a different name, not in nodeinfo
  server.maxchars = (instancev1?.configuration?.statuses?.max_characters ?? instancev1?.max_toot_chars) ?? null;
  server.description = (instancev1?.description ? instancev1.description : instancev1?.short_description) ?? null;

  // Firefish.social and Fedibird don't have a working instance API.

  let nodeInfo;
  
  nodeInfo = await getNodeInfo(server.id);
  let repo = nodeInfo?.software?.repository ?? nodeInfo?.metadata?.repositoryUrl;
  
  server.software = server.software ?? nodeInfo?.software?.name + (repo ? " from " + repo : "");
  server.version = server.version ?? nodeInfo?.software?.version;
  server.description = server.description ?? nodeInfo?.metadata?.nodeDescription;
  server.mau = (server.mau ?? nodeInfo?.usage?.users?.activeMonth) ?? null;
  server.maxchars = (server.maxchars ?? nodeInfo?.metadata?.maxNoteTextLength) ?? null;
  server.registrationsEnabled = server.registrationsEnabled ?? nodeInfo?.openRegistrations;
  server.users = server.users ?? nodeInfo?.usage?.users?.total;
  
  console.log(nodeInfo?.software?.name);

  switch (nodeInfo?.software?.name) {
    case 'mastodon':
      let instancev2 = await getInstance(server.id, 'v2');
      server.translation = instancev2?.configuration?.translation?.enabled ?? null;
      break;
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
      server.avatar = server.avatar ?? 'https://pixelfed.nyc3.cdn.digitaloceanspaces.com/logos/pixelfed-full-color.svg'
    case 'wordpress':
      server.avatar = server.avatar ?? 'https://joinfediverse.wiki/images/2/20/WordPress_logo.svg'
    case 'peertube':
      server.avatar = server.avatar ?? 'https://joinfediverse.wiki/images/7/7c/PeerTube_logo.svg'
    case 'gnusocial':
      server.avatar = server.avatar ?? 'https://joinfediverse.wiki/images/a/a3/GNU_social_logo.svg'
    default:
      server.avatar = server.avatar ?? 'https://joinfediverse.wiki/images/4/40/Fediverse.svg';
  }


  let maupct = server.mau/server.users;
  server.maupct = maupct ? Number(maupct).toLocaleString(new Intl.NumberFormat(), {style: 'percent', minimumFractionDigits:2}) : null;
  
  let emojos; 
  try {
    emojos = await getEmojis(server.id, "category");
    server.emojos = emojos;
  } catch (error) {
    console.log("Error getting custom emojis");
    console.log(error);
    
    server.emojos = null;
  }

  if (!instancev1 && !nodeInfo && !emojos) {
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

const getEmojis = async (domain, group) => {
  const axios = window.axios;
  let response;

  try {
    response = await axios.get('https://emojosapi.santisbon.me/emojis/' + domain.trim(), {
      timeout: 20000
    });
  } catch (error) {
    console.log("Error getting emojis");
    console.log(error);
    response = null;
  }
  
  return response?.data ?? null;
};

async function getNodeInfo(domain) {
  const axios = window.axios;
  let response;
  let nodeInfoLink;

  try {
    response = await axios.get('https://emojosapi.santisbon.me/nodeinfo/' + domain.trim(), {
      timeout: 4000
    });
  } catch (error) {
    console.log("Error getting node info");
    console.log(error);
    response = null;
  }

  return response?.data ?? null;
}

async function getInstance(domain, version = 'v1') {
  const axios = window.axios;
  let response;
  try {
    response = await axios.get(`https://emojosapi.santisbon.me/instance/${version}/${domain.trim()}` , {
      timeout: 4000
    });
  } catch (error) {
    console.log("Error getting instance " + `${version}` + ` for ${domain.trim()}`);
    console.log(error);
  }

  return response?.data ?? null;
}
