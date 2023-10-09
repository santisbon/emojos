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
    data = await getCustomEmojis(id, "category");
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

async function getCustomEmojis(domain, group) {
  let url = 'https://' + domain + "/api/v1/custom_emojis" 
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
