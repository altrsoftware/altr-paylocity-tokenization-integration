const axios = require('axios');

/**
 * Returns an auth token from domain env based upon clientId and clientSecret env
 * @returns {string} Auth token
 */
const getAuth = async () => {

    const { domain, clientId, clientSecret } = process.env;

    const missingParams = [];
    if(!domain) missingParams.push('domain')
    if(!clientId) missingParams.push('clientId')
    if(!clientSecret) missingParams.push('clientSecret')
    if(missingParams.length != 0) throw `${missingParams} is undefined`;

    const config = {
        method: 'POST',
        url: domain + '/IdentityServer/connect/token',
        data: {
            grant_type: 'client_credentials',
            scope: 'WebLinkAPI'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        },
    };

    return await axios(config)
        .then((response) => {
            return response.data.access_token
        }).catch((e) => {
            throw 'Can not authenticate';
        })
}

module.exports = getAuth;