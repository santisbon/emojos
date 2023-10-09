import axios from 'axios';

/**
 * A simple example includes a HTTP get method to get one item by id.
 */
export const getByIdHandler = async (event) => {
  /* if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  } */
  
  // All log statements are written to CloudWatch
  console.info('received:', event);
 
  //TODO: Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
  const id = event.pathParameters.id;
  let data;
 
  try {
    data = await getNodeInfo(id);
  } catch (err) {
    console.log("Error", err);
  }
 
  const response = {
    statusCode: 200,
    body: JSON.stringify(data)
  };
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}

async function getNodeInfo(domain) {
  let response;
  let nodeInfoLink;

  try {
    response = await axios.get('https://' + domain.trim() + `/.well-known/nodeinfo`, {
      timeout: 4000
    });
    let links = response?.data.links ?? null;
    if (links) {
      nodeInfoLink = links[links.length -1].href;
    }

    response = await axios.get(nodeInfoLink, {
      timeout: 4000
    });
  } catch (error) {
    console.log("Error getting node info");
    console.log(error);
    response = null;
  }

  return response?.data ?? null;
}
