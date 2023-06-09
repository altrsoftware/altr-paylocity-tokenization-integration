const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const s3Export = require('../utils/s3Export');

let mock;

beforeAll(() => {
	mock = new MockAdapter(axios);
});

afterEach(() => {
	mock.reset();
});

let props;

describe('TESTING s3Export(props)', () => {

    describe('When argument props is undefined', () => {
        it('should throw "Exception: argument props is undefined"', async () => {
            try {
                await s3Export(undefined);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: argument props is undefined");
            }
        });
    });

    describe('When argument props is type "string"', () => {
        it('should throw "Exception: argument props must be type object"', async () => {
            try {
                await s3Export("fakeProps");
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: argument props must be type object");
            }
        });
    });

    describe('When argument props is an empty object', () => {
        it('should throw "Exception: argument props must not be empty"', async () => {
            props = {};
            try {
                await s3Export(props);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: argument props must not be empty");
            }
        });
    });

    describe('When argument props is missing name and body', () => {
        it('should throw "Exception: props name,body is undefined"', async () => {
            props = {
                "value": "fakeValue"
            }
            try {
                await s3Export(props);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: props name,body is undefined");
            }
        });
    });

    describe('When argument props is missing name', () => {
        it('should throw "Exception: props name is undefined"', async () => {
            props = {
                "body": "fakeBody",
            }
            try {
                await s3Export(props);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: props name is undefined");
            }
        });
    });

    describe('When props contains necessary values and s3Endpoint and s3Key is undefined', () => {
        it('should throw "Exception: s3Endpoint,s3Key is undefined"', async () => {
            props = {
                "body": "fakeBody",
                "name": "fakeName"
            }
            try {
                await s3Export(props);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: s3Endpoint,s3Key is undefined");
            }
        });
    });

    describe('When props contains necessary values and s3Endpoint is undefined', () => {
        it('should throw "Exception: s3Endpoint,s3Key is undefined"', async () => {
            props = {
                "body": "fakeBody",
                "name": "fakeName"
            }
            process.env = {
                ...process.env,
                "s3Key": "fakeS3Key"
            }
            try {
                await s3Export(props);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("Exception: s3Endpoint is undefined");
            }
        });
    });

    describe('When props contains necessary values and s3Endpoint and s3Key are defined', () => {

        describe('When s3Export fails', () => {
            it('should throw "Exception: Can not export to s3"', async () => {
                props = {
                    "body": "fakeBody",
                    "name": "fakeName"
                }
                process.env = {
                    ...process.env,
                    "s3Key": "fakeS3Key",
                    "s3Endpoint": "fakeS3Endpoint"
                }
                mock.onPost(process.env.s3Endpoint).reply(404, {});
                try {
                    await s3Export(props);
                    expect(true).toStrictEqual(false);
                } catch(e) {
                    expect(e).toStrictEqual("Exception: Can not export to s3");
                }
            });
        });

        describe('When s3Export succeeds', () => {
            it('should return "s3 export success"', async () => {
                props = {
                    "body": "fakeBody",
                    "name": "fakeName"
                }
                process.env = {
                    ...process.env,
                    "s3Key": "fakeS3Key",
                    "s3Endpoint": "fakeS3Endpoint"
                }
                mock.onPost(process.env.s3Endpoint).reply(202, {});
                const response = await s3Export(props);
                expect(response).toStrictEqual('s3 export success');
            });
        });

    });

});