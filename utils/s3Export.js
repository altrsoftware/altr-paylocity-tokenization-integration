const axios = require('axios');

/**
 * Exports Paylocity data to an AWS S3 bucket via an API Gateway
 * @param {Object} props An object containing necessary properties, name and body
 * @returns {any} The API Gateway response body
 */
const s3Export = async (props) => {

    if(props === undefined) throw 'argument props is undefined';
    if(typeof props !== 'object') throw 'argument props must be type object';
    if(Object.keys(props).length === 0) throw 'argument props must not be empty';
    
    const missingProps = [];
    if(!props.name) missingProps.push('name');
    if(!props.body) missingProps.push('body');
    if(missingProps.length != 0) throw `props ${missingProps} is undefined`;

    const { s3Endpoint, s3Key } = process.env;

    const missingParams = [];
    if(!s3Endpoint) missingParams.push('s3Endpoint');
    if(!s3Key) missingParams.push('s3Key');
    if(missingParams.length !== 0) throw `${missingParams} is undefined`;

    const config = {
        method: 'Post',
        url: s3Endpoint,
        headers: {
          'X-API-KEY': s3Key,
        },
        data: {
          name: props.name,
          body: props.body
        }
    };
    return await axios(config)
        .then(res => 's3 export success')
        .catch(err => {
            throw 'Can not export to s3';
        })

}

module.exports = s3Export;