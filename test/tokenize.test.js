const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const tokenize = require('../utils/tokenize');

let mock;

beforeAll(() => {
	mock = new MockAdapter(axios);
});

afterEach(() => {
	mock.reset();
});

describe('TESTING tokenize(payload)', () => {

    describe('When payload, mapiKey, mapiSecret is undefined', () => {
        it('should throw "payload must have type object"', async () => {
            try {
                await tokenize(undefined);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("payload must have type object");
            }
        });
    });

    describe('When mapiKey, mapiSecret is undefined and payload is an empty object', () => {
        it('should throw "object payload must not be empty"', async () => {
            try {
                await tokenize({});
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("object payload must not be empty");
            }
        });
    });

    describe('When mapiKey, mapiSecret is undefined and payload is a non-empty object', () => {
        it('should throw "mapiKey,mapiSecret is undefined"', async () => {
            try {
                const payload = { fakeKey: "fakeValue" };
                await tokenize(payload);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("mapiKey,mapiSecret is undefined");
            }
        });
    });

    describe('When mapiKey is undefined, mapiSecret is defined, and payload is a non-empty object', () => {
        it('should throw "mapiKey is undefined"', async () => {
            process.env = {
                ...process.env,
                mapiSecret: "fakeMapiSecret"
            }
            const payload = { fakeKey: "fakeValue" };
            try {
                await tokenize(payload);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("mapiKey is undefined");
            }
        });
    });

    describe('When mapiKey, mapiSecret is defined, and payload is a non-empty object', () => {

        describe('When the mapiKey and mapiSecret are invalid', () => {
            it('should return "Can not tokenize"', async () => {
                mock.onPost('https://vault.live.altr.com/api/v1/batch').reply(401, { data: {} });
                process.env = {
                    ...process.env,
                    mapiKey: "fakeMapiKey",
                    mapiSecret: "fakeMapiSecret"
                }
                const payload = { fakeKey: "fakeValue" };
                try {
                    await tokenize(payload);
                } catch(e) {
                    expect(e).toStrictEqual("Can not tokenize");
                }
            });
        });

        describe('When the mapiKey and mapiSecret are valid', () => {
            it('should return an object containing tokens', async () => {
                mock.onPost('https://vault.live.altr.com/api/v1/batch').reply(200, { data: { "1": "token_fakeToken" } });
                process.env = {
                    ...process.env,
                    mapiKey: "fakeMapiKey",
                    mapiSecret: "fakeMapiSecret"
                }
                const payload = { fakeKey: "fakeValue" };
                const tokens = await tokenize(payload);
                expect(JSON.stringify(tokens)).toStrictEqual(JSON.stringify({ "1": "token_fakeToken" }));
            });
        });

        describe('When the mapiKey and mapiSecret are valid and the dev environment variable is "true"', () => {
            it('should return an object containing tokens', async () => {
                mock.onPost('https://vault.preview.altr.com/api/v1/batch').reply(200, { data: { "1": "token_fakeToken" } });
                process.env = {
                    ...process.env,
                    mapiKey: "fakeMapiKey",
                    mapiSecret: "fakeMapiSecret",
                    dev: "true"
                }
                const payload = { fakeKey: "fakeValue" };
                const tokens = await tokenize(payload);
                expect(JSON.stringify(tokens)).toStrictEqual(JSON.stringify({ "1": "token_fakeToken" }));
            });
        });

    });

});