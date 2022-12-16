const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const main = require('../utils/index');

let mock;

beforeAll(() => {
	mock = new MockAdapter(axios);
});

afterEach(() => {
	mock.reset();
    process.env = {};
});

let config;
let response;

describe("TESTING main(config)", () => {

    describe('When config is undefined', () => {
        it('should throw "config is undefined"', async () => {
            config = undefined;
            try {
                await main(config);
                expect(false).toStrictEqual(true);
            } catch(e) {
                expect(e).toStrictEqual("config is undefined");
            }
        });
    });

    describe('When config is not type object', () => {
        it('should throw "config must be type object"', async () => {
            config = "fakeConfig";
            try {
                await main(config);
                expect(false).toStrictEqual(true);
            } catch(e) {
                expect(e).toStrictEqual("config must be type object");
            }
        });
    });

    describe('When config is an empty object', () => {
        it('should throw "config must not be empty"', async () => {
            config = {};
            try {
                await main(config);
                expect(false).toStrictEqual(true);
            } catch(e) {
                expect(e).toStrictEqual("config must not be empty");
            }
        });
    });

    describe('When config is a non-empty object and getAuth() fails', () => {
        it('should throw "domain,clientId,clientSecret is undefined"', async () => {
            config = {
                "fakeKey": "fakeValue"
            };
            try {
                await main(config);
                expect(false).toStrictEqual(true);
            } catch(e) {
                expect(e).toStrictEqual("domain,clientId,clientSecret is undefined");
            }
        });
    });

    describe('When getAuth() succeeds and getFunction(config) fails', () => {
        it('should throw "undefined is not a valid function name"', async () => {
            config = {
                "fakeKey": "fakeValue"
            };
            process.env = {
                ...process.env,
                "domain": "fakeDomain",
                "clientId": "fakeClientId",
                "clientSecret": "fakeClientSecret"
            }
            mock.onPost('fakeDomain/IdentityServer/connect/token').reply(200, { access_token: "fakeAccessToken" });
            try {
                await main(config);
                expect(false).toStrictEqual(true);
            } catch(e) {
                expect(e).toStrictEqual("undefined is not a valid function name");
            }
        });
    });

    describe('When getFunction(config) succeeds and fetching paylocity data fails', () => {
        it('should throw "Can not fetch paylocity data"', async () => {
            config = {
                "Function": "getEmployeeIds",
                "Parameters": {
                    "pageSize": "10",
                    "pageNumber": "0"
                }
            };
            process.env = {
                ...process.env,
                "domain": "fakeDomain",
                "clientId": "fakeClientId",
                "clientSecret": "fakeClientSecret"
            }
            mock.onPost('fakeDomain/IdentityServer/connect/token').reply(200, { access_token: "fakeAccessToken" });
            mock.onGet('fakeDomain/api/v2/companies/undefined/employees?pagesize=10&pagenumber=0').reply(404, "fail");
            try {
                await main(config);
                expect(false).toStrictEqual(true);
            } catch(e) {
                expect(e).toStrictEqual('Can not fetch paylocity data');
            }
        });
    });

    describe('When fetching Paylocity data succeeds and tokenization fails', () => {
        it('should tranform untokenized value to "tokenization failed"', async () => {
            config = {
                "Function": "getEmployeeIds",
                "Parameters": {
                    "pageSize": "10",
                    "pageNumber": "0"
                },
                "Tokenize": ["fakeKey"]
            };
            process.env = {
                ...process.env,
                "domain": "fakeDomain",
                "clientId": "fakeClientId",
                "clientSecret": "fakeClientSecret"
            }
            mock.onPost('fakeDomain/IdentityServer/connect/token').reply(200, { access_token: "fakeAccessToken" });
            mock.onGet('fakeDomain/api/v2/companies/undefined/employees?pagesize=10&pagenumber=0').reply(200, { "fakeKey": "fakeValueToTokenize" });
            response = await main(config);
            expect(JSON.stringify(response)).toStrictEqual(JSON.stringify({ "fakeKey": "tokenization failed" }));
        });
    });
    
    describe('When Tokenization succeeds and S3 Export fails', () => {
        it('should throw "s3Key is undefined"', async () => {
            config = {
                "Function": "getEmployeeIds",
                "Parameters": {
                    "pageSize": "10",
                    "pageNumber": "0"
                },
                "Tokenize": ["fakeKey"],
                "Export": "true"
            };
            process.env = {
                ...process.env,
                "domain": "fakeDomain",
                "clientId": "fakeClientId",
                "clientSecret": "fakeClientSecret",
                "mapiKey": "fakeKey",
                "mapiSecret": "fakeSecret",
                "s3Endpoint": "fakeS3Endpoint",
            }
            mock.onPost('fakeDomain/IdentityServer/connect/token').reply(200, { access_token: "fakeAccessToken" });
            mock.onGet('fakeDomain/api/v2/companies/undefined/employees?pagesize=10&pagenumber=0').reply(200, { "fakeKey": "fakeValueToTokenize" });
            mock.onPost('https://vault.live.altr.com/api/v1/batch').reply((config) => [200, { "data": { [Object.keys(JSON.parse(config.data))]: "token_fakeToken" } }]);
            mock.onPost('');
            try {
                await main(config);
                expect(false).toStrictEqual(true);
            } catch(e) {
                expect(e).toStrictEqual("s3Key is undefined");
            }
        });
    });

    describe('When Tokenization succeeds and S3 Export fails', () => {
        it('should tranform untokenized value to "tokenization failed"', async () => {
            config = {
                "Function": "getEmployeeIds",
                "Parameters": {
                    "pageSize": "10",
                    "pageNumber": "0"
                },
                "Tokenize": ["fakeKey"],
                "Export": "true",
            };
            process.env = {
                ...process.env,
                "domain": "fakeDomain",
                "clientId": "fakeClientId",
                "clientSecret": "fakeClientSecret",
                "mapiKey": "fakeKey",
                "mapiSecret": "fakeSecret",
                "s3Endpoint": "fakeS3Endpoint",
                "s3Key": "fakeS3Key",
            }
            mock.onPost('fakeDomain/IdentityServer/connect/token').reply(200, { access_token: "fakeAccessToken" });
            mock.onGet('fakeDomain/api/v2/companies/undefined/employees?pagesize=10&pagenumber=0').reply(200, { "fakeKey": "fakeValueToTokenize" });
            mock.onPost('https://vault.live.altr.com/api/v1/batch').reply((config) => [200, { "data": { [Object.keys(JSON.parse(config.data))]: "token_fakeToken" } }]);
            mock.onPost('fakeS3Endpoint').reply(200, "s3 export success");
            response = await main(config);
            expect(JSON.stringify(response)).toStrictEqual(JSON.stringify({ "fakeKey": "token_fakeToken" }));
        });
    });

});