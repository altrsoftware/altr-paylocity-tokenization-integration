const axios = require('axios');

const sendGetRequest = async (auth, url) => {
    if(auth == undefined) throw 'Exception: Auth is not defined';
    if(url == undefined) throw 'Exception: URL is not defined';

    const domain = process.env.domain ?? 'https://api.paylocity.com';

    var config = {
      method: 'GET',
      url: domain + url,
      headers: {
        'Authorization': auth,
      },
    };

    return await axios(config)
        .then(response => response)
        .catch(() => {
            throw 'Exception: Can not fetch paylocity data';
        });
}

module.exports = sendGetRequest;