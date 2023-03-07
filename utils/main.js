const s3Export = require('./s3Export');
const tokenize = require('./tokenize');
const getFunction = require('./functions').getFunction;
const sendGetRequest = require('./sendGetRequest');

/**
 * Retrieves data from Paylocity and tokenizes using ALTR's vaulted tokenization API
 * @param {Object} config An object containing request and tokenization configuration
 * @returns {[Object]} An array containing response objects with appropriately tokenized fields
 */
const main = async (config) => {

    if(config === undefined) throw "Exception: config is undefined";
    if(typeof config !== 'object') throw "Exception: config must be type object";
    if(Object.keys(config).length === 0) throw "Exception: config must not be empty";

    const auth = 'Bearer ' + await require('./getAuth')();

    let _function = getFunction(config);

    let data = (await sendGetRequest(auth, _function)).data;
    
    if(Array.isArray(config?.Tokenize) && config.Tokenize.length > 0) data = await tokenize(data, config.Tokenize);

    if(config.Export === "true") {
        await s3Export({body: data, name: `${config.Function}-${new Date().toISOString()}.json`});
    }

    return data;

}

module.exports = main;