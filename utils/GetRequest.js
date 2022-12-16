class GetRequest {

  constructor(auth) {
    if(!auth) throw 'Auth is not defined';
    this.auth = auth;
  }

  /**
   * Creates a GET Request configuration to be sent the API domain specified in env
   * @param {string} url The path to the requested resource with appropriate parameters
   * @returns {Object} The configuration for an axios request
   */
  createGetRequest(url) {

    if(url == undefined) throw 'URL is not defined';
  
    const domain = process.env.domain ?? 'https://api.paylocity.com';
  
    var config = {
      method: 'GET',
      url: domain + url,
      headers: {
        'Authorization': this.auth,
      },
    };
  
    return config;

  }

}

module.exports = GetRequest;