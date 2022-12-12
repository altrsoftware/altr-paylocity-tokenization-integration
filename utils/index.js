const s3Export = require('./s3Export');
const GetRequest = require('./GetRequest');
const tokenize = require('./tokenize');
const getFunction = require('./functions');
const axios = require('axios');

/**
 * Retrieves data from Paylocity and tokenizes using ALTR's vaulted tokenization API
 * @param {Object} config An object containing request and tokenization configuration
 * @returns {[Object]} An array containing response objects with appropriately tokenized fields
 */
const main = async (config) => {

    if(config === undefined) throw "config is undefined";
    if(typeof config !== 'object') throw "config must be type object";
    if(Object.keys(config).length === 0) throw "config must not be empty";

    const auth = 'Bearer ' + await require('./getAuth')();

    const getRequest = new GetRequest(auth);

    let _function = getFunction(config);

    console.log("Sending request: " + config.Function);

    let axiosConfig = getRequest.createGetRequest(_function);
    let res = await axios(axiosConfig)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error)
            return undefined;
        })
    
    if(res === undefined) throw 'Can not fetch paylocity data';
    
    for(let tokenizeIndex in config.Tokenize) {
        console.log("Tokenizing " + config.Tokenize[tokenizeIndex])
        const toTokenize = config.Tokenize[tokenizeIndex];
        try {
            res[toTokenize] = (await tokenize({[toTokenize]: res[toTokenize]}))[toTokenize];
        } catch(e) {
            res[toTokenize] = "tokenization failed";
            console.error('failed to tokenize ' + toTokenize);
        }
    }
    if(config.Export === "true") {
        const exportSuccess = await s3Export({body: res, name: `${config.Function}-${new Date().toISOString()}.json`});
        console.log(exportSuccess);
    }

    return res;

}

module.exports = main;