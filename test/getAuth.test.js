const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const getAuth = require('../utils/getAuth');

let mock;

beforeAll(() => {
	mock = new MockAdapter(axios);
});

afterEach(() => {
	mock.reset();
});

describe('TESTING getAuth()', () => {

    describe('When domain, clientId, clientSecret is undefined', () => {
        it('should throw "Exception: domain,clientId,clientSecret is undefined"', async () => {
            try {
                await getAuth();
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: domain,clientId,clientSecret is undefined");
            }
        });
    });

    describe('When only one parameter, clientId, is undefined', () => {
        it('should throw "Exception: clientId is undefined"', async () => {
            process.env = {
                ...process.env,
                domain: 'fakeDomain',
                clientSecret: 'fakeSecret'
            }
            try {
                await getAuth();
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: clientId is undefined");
            }
        });
    });

    describe('When all parameters are defined and the request can not be authenticated', () => {
        it('should throw "Exception: Can not authenticate"', async () => {

            mock.onPost('fakeDomain/IdentityServer/connect/token').reply(401, { access_token: "fakeInvalidAuth" });

            process.env = {
                ...process.env,
                domain: 'fakeDomain',
                clientId: 'fakeClientId',
                clientSecret: 'fakeSecret'
            }

            try {
                await getAuth();
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual('Exception: Can not authenticate');
            }
        });
    });

    describe('When all parameters are defined and the request is authenticated', () => {
        it('should return a valid auth', async () => {

            mock.onPost('fakeDomain/IdentityServer/connect/token').reply(200, { access_token: "fakeValidAuth" });

            process.env = {
                ...process.env,
                domain: 'fakeDomain',
                clientId: 'fakeClientId',
                clientSecret: 'fakeSecret'
            }

            const auth = await getAuth();
            expect(auth).toStrictEqual('fakeValidAuth');
        });
    });

});