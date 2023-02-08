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

    if(config === undefined) throw "config is undefined";
    if(typeof config !== 'object') throw "config must be type object";
    if(Object.keys(config).length === 0) throw "config must not be empty";

    const auth = 'Bearer ' + await require('./getAuth')();

    let _function = getFunction(config);

    let res = (await sendGetRequest(auth, _function)).data;
    
    const data = Array.isArray(res) ? [] : {};
    for(let item in res) {
        for(let tokenizeIndex in config.Tokenize) {
            const toTokenize = config.Tokenize[tokenizeIndex];
            if(!(res[item].hasOwnProperty(toTokenize) || res.hasOwnProperty(toTokenize))) continue;
            try {
                if(res[item].hasOwnProperty(toTokenize)) res[item][toTokenize] = (await tokenize({[toTokenize]: res[item][toTokenize]}))[toTokenize];
                else res[toTokenize] = (await tokenize({[toTokenize]: res[toTokenize]}))[toTokenize];
            } catch(e) {
                res[item][toTokenize] = "tokenization failed";
                console.error('failed to tokenize ' + toTokenize);
            }
        }
        data[item] = res[item];
    }

    if(config.Export === "true") {
        await s3Export({body: data, name: `${config.Function}-${new Date().toISOString()}.json`});
    }

    return data;

}

module.exports = main;