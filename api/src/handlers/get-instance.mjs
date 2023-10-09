import axios from 'axios';

export const getByIdHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);
 
  const id = event.pathParameters.id;
  let data;
 
  try {
    data = await getInstance(id);
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

async function getInstance(domain, version = "v2") {
  //const axios = window.axios;
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
