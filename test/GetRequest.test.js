const GetRequest = require('../utils/GetRequest');

let url;
let auth;
let functionCall;
let getReqeust;

describe("TESTING GetRequest.constructor", () => {

    describe("When auth is undefined", () => {
        it('should throw "Auth is not defined"', () => {
            auth = undefined;
            functionCall = () => new GetRequest(auth);
            expect(functionCall).toThrow("Auth is not defined");
        });
    });

    describe("When auth is defined", () => {
        it('should return a GetRequest object', () => {
            auth = "fakeAuth";
            getRequest = new GetRequest(auth);
            expect(getRequest instanceof GetRequest).toStrictEqual(true);
        });
    });

});

describe("TESTING GetRequest.createGetRequest(url)", () => {

    describe("When url is undefined", () => {
        it('should throw "URL is not defined"', () => {
            url = undefined
            auth = "fakeAuth";
            getReqeust = new GetRequest(auth);
            functionCall = () => { getReqeust.createGetRequest(url) }
            expect(functionCall).toThrow("URL is not defined");
        });
    });

    describe("When url is defined", () => {
        it('should return a valid axios config object', () => {
            url = "/fakeURL";
            auth = "fakeAuth";
            getRequest = new GetRequest(auth);
            functionCall = () => { getRequest.createGetRequest(url) }
            expect(JSON.stringify(getRequest.createGetRequest(url))).toStrictEqual(JSON.stringify({method: 'GET', url: 'https://api.paylocity.com/fakeURL', headers: { Authorization: 'fakeAuth' }}));
        });
    });

});