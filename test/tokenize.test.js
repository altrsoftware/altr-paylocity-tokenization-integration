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

    describe('When data, tokenizeKeys, mapiKey, mapiSecret is undefined', () => {
        it('should throw "Exception: data must have type object"', async () => {
            try {
                await tokenize(undefined, undefined);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: data must have type object");
            }
        });
    });

    describe('When tokenizeKeys, mapiKey, mapiSecret is undefined and payload is an empty object', () => {
        it('should throw "Exception: object data must not be empty"', async () => {
            try {
                await tokenize({}, undefined);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: object data must not be empty");
            }
        });
    });

    describe('When tokenizeKeys exists and is not an Array, mapiKey and mapiSecret are undefined and payload is a non-empty object', () => {
        it('should throw "Exception: Tokenize must have type Array"', async () => {
            try {
                const payload = { fakeKey: "fakeValue" };
                await tokenize(payload, {});
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: Tokenize must have type Array");
            }
        });
    });

    describe('When mapiKey and mapiSecret are undefined, and tokenizeKeys does not exist', () => {
        it('should throw "Exception: mapiKey,mapiSecret is undefined"', async () => {
            process.env = {
                ...process.env,
            }
            const payload = { fakeKey: "fakeValue" };
            try {
                await tokenize(payload, undefined);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: mapiKey,mapiSecret is undefined");
            }
        });
    });

    describe('When mapiKey is defined, mapiSecret is undefined, and tokenizeKeys is an Array', () => {
        it('should return "Exception: mapiSecret is undefined"', async () => {
            process.env = {
                ...process.env,
                mapiKey: "fakeMapiKey",
            }
            const payload = { fakeKey: "fakeValue" };
            try {
                await tokenize(payload, []);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: mapiSecret is undefined");
            }
        });
    });

    describe('When mapiKey, mapiSecret are defined, and tokenizeKeys is an Array containing a field to tokenize, but the tokenization request failed authentication', () => {
        it('should return failed tokenized values as "tokenization failed"', async () => {
            mock.onPost('https://vault.live.altr.com/api/v1/batch').reply(401, { data: {} });
            process.env = {
                ...process.env,
                mapiKey: "fakeMapiKey",
                mapiSecret: "fakeMapiSecret"
            }
            const payload = { fakeKey: "fakeValue" };
            const data = await tokenize(payload, ["fakeKey"]);
            expect(JSON.stringify(data)).toStrictEqual(JSON.stringify({ fakeKey: "tokenization failed" }));
        });
    });

    describe('When mapiKey, mapiSecret are defined, tokenizeKeys is an Array containing a field to tokenize, and data is successfully tokenized', () => {
        describe('When data contains no nested objects', () => {
            it('should return correctly tokenized values', async () => {
                mock.onPost('https://vault.live.altr.com/api/v1/batch').reply(200, { data: { "fakeKey": "fakeToken" } });
                process.env = {
                    ...process.env,
                    mapiKey: "fakeMapiKey",
                    mapiSecret: "fakeMapiSecret"
                }
                const payload = { fakeKey: "fakeValue" };
                const data = await tokenize(payload, ["fakeKey"]);
                expect(JSON.stringify(data)).toStrictEqual(JSON.stringify({ fakeKey: "fakeToken" }));
            });
        });

        describe('When data does contain nested objects', () => {
            it('should return correctly tokenized values', async () => {
                mock.onPost('https://vault.live.altr.com/api/v1/batch').reply(200, { data: { "fakeKey": "fakeToken", "fakeObject.fakeKey": "fakeToken2" } });
                process.env = {
                    ...process.env,
                    mapiKey: "fakeMapiKey",
                    mapiSecret: "fakeMapiSecret"
                }
                const payload = { fakeKey: "fakeValue", fakeObject: { fakeKey: "fakeValue2" } };
                const data = await tokenize(payload, ["fakeKey"]);
                expect(JSON.stringify(data)).toStrictEqual(JSON.stringify({ fakeKey: "fakeToken", fakeObject: { fakeKey: "fakeToken2" } }));
            });
        });
        
        describe('When dev is true', () => {
            it('should use altr preview to return correctly tokenized values', async () => {
                mock.onPost('https://vault.preview.altr.com/api/v1/batch').reply(200, { data: { "fakeKey": "fakeToken" } });
                process.env = {
                    ...process.env,
                    mapiKey: "fakeMapiKey",
                    mapiSecret: "fakeMapiSecret",
                    dev: "true"
                }
                const payload = { fakeKey: "fakeValue" };
                const data = await tokenize(payload, ["fakeKey"]);
                expect(JSON.stringify(data)).toStrictEqual(JSON.stringify({ fakeKey: "fakeToken" }));
            });
        });
    });

});