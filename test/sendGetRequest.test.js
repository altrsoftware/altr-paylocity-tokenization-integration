const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const sendGetRequest = require('../utils/sendGetRequest');

let mock;

beforeAll(() => {
	mock = new MockAdapter(axios);
});

afterEach(() => {
	mock.reset();
});

let url;
let auth;
let functionCall;
let response;

describe('TESTING sendGetRequest(auth, url)', () => {
    
    describe('When auth is undefined', () => {
        it('should throw "Exception: Auth is not defined"', async () => {
            url = '/fakeURL';
            auth = undefined;
            try {
                await sendGetRequest(auth, url);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: Auth is not defined");
            }
        });
    });
    
    describe('When auth is defined and url is undefined', () => {
        it('should throw "Exception: URL is not defined"', async () => {
            url = undefined;
            auth = 'fakeAuth';
            try {
                await sendGetRequest(auth, url);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: URL is not defined");
            }
        });
    });

    describe('When auth and url are defined', () => {

        describe('When auth and/or url are invalid', () => {
            it('should throw "Exception: Can not fetch paylocity data"', async () => {
                url = '/invalidURL';
                auth = 'invalidAuth';
                mock.onGet('https://api.paylocity.com/invalidURL').reply(401, { error: "invalid request" })
                try {
                    await sendGetRequest(auth, url);
                    expect(true).toStrictEqual(false);
                } catch(e) {
                    expect(e).toStrictEqual("Exception: Can not fetch paylocity data");
                }
            });
        });

        describe('When auth and url are valid', () => {
            it('should return a valid payload', async () => {
                url = '/fakeURL';
                auth = 'fakeAuth';
                process.env = {
                    ...process.env,
                    domain: 'fakeDomain'
                }
                mock.onGet('fakeDomain/fakeURL').reply(200, { data: 'valid data' });
                response = await sendGetRequest(auth, url);
                expect(JSON.stringify(response.data)).toStrictEqual(JSON.stringify({ data: 'valid data' }));
                expect(JSON.stringify(response.status)).toStrictEqual(JSON.stringify(200));
            })
        })

    });

});