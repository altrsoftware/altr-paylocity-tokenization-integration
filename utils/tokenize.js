const axios = require('axios');

/**
 * Requests tokenization or detokenization from ALTR's Vaulted Tokenization API
 * @param {Object} payload An object containing the values which will be tokenized
 * @returns {Object} The response from ALTR's Vaulted Tokenization API
 */
const tokenize = async (payload) => {
    const date = new Date();
    const { mapiKey, mapiSecret } = process.env;

    if(typeof payload !== 'object') throw 'payload must have type object';
    if(Object.keys(payload).length === 0) throw 'object payload must not be empty';

    const missingParams = [];
    if(!mapiKey) missingParams.push('mapiKey');
    if(!mapiSecret) missingParams.push('mapiSecret');
    if(missingParams.length != 0) throw `${missingParams} is undefined`;
    
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
          throw 'Can not tokenize';
      });
}

module.exports = tokenize;