const s3Export = require('./s3Export');
const tokenize = require('./tokenize');
const getFunction = require('./functions');
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

    console.log("Sending request: " + config.Function);

    let res = (await sendGetRequest(auth, _function)).data;
    
    const data = [];
    for(let item in res) {
        for(let tokenizeIndex in config.Tokenize) {
            console.log("Tokenizing " + config.Tokenize[tokenizeIndex])
            const toTokenize = config.Tokenize[tokenizeIndex];
            try {
                res[item][toTokenize] = (await tokenize({[toTokenize]: res[item][toTokenize]}))[toTokenize];
            } catch(e) {
                res[item][toTokenize] = "tokenization failed";
                console.error('failed to tokenize ' + toTokenize);
            }
        }
        data.push(res[item]);
    }

    if(config.Export === "true") {
        const exportSuccess = await s3Export({body: data, name: `${config.Function}-${new Date().toISOString()}.json`});
        console.log(exportSuccess);
    }

    return data;

}

module.exports = main;