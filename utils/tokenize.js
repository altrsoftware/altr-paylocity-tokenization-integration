const axios = require('axios');
let mapiKey, mapiSecret;

/**
 * Recursively aggregates paths to each occurrence in object o of key s
 * @param {Object} o An object containing Paylocity data
 * @param {Array} s An array containing the fields to tokenize
 * @returns {Array} An array of paths to each occurence of key s in object o
 */
function findKeyPath(o, s) {

  let result = [];

  function search(obj, key, path) {
      for (let k in obj) {
          if (key.includes(k)) {
              result.push([...path, k]);
          }
          if (typeof obj[k] === "object") {
              search(obj[k], key, [...path, k]);
          }
      }
  }

  search(o, s, []);
  return result;

}

/**
* Uses function findKeyPath to aggregate values to tokenize and send, in bulk, to ALTR's tokenization API
* @param {Object} data An object containing all Paylocity data
* @param {Array} tokenizeKeys An array containing the fields to tokenize
* @returns {Object} The original object, data, with the properly tokenized values inserted
*/
async function toTokens(data, tokenizeKeys) {

  mapiKey = process.env?.mapiKey;
  mapiSecret = process.env?.mapiSecret;

  if(typeof data !== 'object') throw 'Exception: data must have type object';
  if(Object.keys(data).length === 0) throw 'Exception: object data must not be empty';
  
  if(!Array.isArray(tokenizeKeys ?? [])) throw 'Exception: Tokenize must have type Array';

  const missingParams = [];
  if(!mapiKey) missingParams.push('mapiKey');
  if(!mapiSecret) missingParams.push('mapiSecret');
  if(missingParams.length != 0) throw `Exception: ${missingParams} is undefined`;

  const pathArray = findKeyPath(data, tokenizeKeys);
  let flatObj = {};
  
  pathArray.forEach(path => {
      let current = data;
      for (let i = 0; i < path.length; i++) {
          const key = path[i];
          current = current[key];
      }
      flatObj[path.join(".")] = current;
  });
  
  try {
      flatObj = await tokenize(flatObj);
  } catch(e) {
      Object.keys(flatObj).forEach(key => {
          flatObj[key] = "tokenization failed"; //JSON.parse(JSON.stringify(e))// "tokenization failed";
      })
  }

  const newObj = JSON.parse(JSON.stringify(data));
  Object.entries(flatObj).forEach(([path, value]) => {
      let current = newObj;
      const pathArray = path.split(".");
      for (let i = 0; i < pathArray.length - 1; i++) {
          const key = pathArray[i];
          current = current[key];
      }
      current[pathArray[pathArray.length - 1]] = value;
  });

  return newObj;

}

/**
 * Requests tokenization or detokenization from ALTR's Vaulted Tokenization API
 * @param {Object} payload An object containing the values which will be tokenized
 * @returns {Object} The response from ALTR's Vaulted Tokenization API
 */
const tokenize = async (payload) => {
    const date = new Date();
    
    const config = {
      method: 'POST',
      url: `https://vault.${process.env.dev == "true" ? 'preview' : 'live'}.altr.com/api/v1/batch`,
      headers: {
        'AUTHORIZATION': `Basic ${Buffer.from(`${mapiKey}:${mapiSecret}`).toString('base64')}`,
        'X-ALTR-DETERMINISM': 'TRUE',
        'DATE': date.toString(),
        'Content-Type': 'application/json'
      },
      data : payload
    };
    
    return await axios(config)
      .then(function (response) {
          return response.data.data;
      })
      .catch(function () {
          throw 'Exception: Can not tokenize';
      });
}

module.exports = toTokens;