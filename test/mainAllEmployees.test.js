const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const mainAllEmployees = require('../utils/mainAllEmployees');

let mock;

beforeAll(() => {
	mock = new MockAdapter(axios);
});

afterEach(() => {
	mock.reset();
    process.env = {};
});

let config;

describe('TESTING mainAllEmployees(config)', () => {

    describe('When config is undefined', () => {
        it('Should throw "config is undefined"', async () => {
            config = undefined;
            try {
                await mainAllEmployees(config);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("config is undefined");
            }
        });
    });

    describe('When config is not an object', () => {
        it('Should throw "config must be type object"', async () => {
            config = "invalid config";
            try {
                await mainAllEmployees(config);
                expect(true).toStrictEqual(false);
            } catch(e) {
                expect(e).toStrictEqual("config must be type object");
            }
        });
    });

    describe('When config is an empty object', () => {
        it('Should throw "config must not be empty"', async () => {
            config = {};
            try {
                await mainAllEmployees(config);
                expect(true).toStrictEqual(false);
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
                await mainAllEmployees(config);
                expect(false).toStrictEqual(true);
            } catch(e) {
                expect(e).toStrictEqual("domain,clientId,clientSecret is undefined");
            }
        });
    });

    describe('When getAuth() succeeds but sendGetRequest fails', () => {
        it('should throw "domain,clientId,clientSecret is undefined"', async () => {
            process.env = {
                ...process.env,
                "domain": "fakeDomain",
                "clientId": "fakeClientId",
                "clientSecret": "fakeClientSecret"
            }
            mock.onPost('fakeDomain/IdentityServer/connect/token').reply(200, { access_token: "fakeAccessToken" });
            mock.onGet('fakeDomain/api/v2/companies/undefined/employees?pagesize=1&pagenumber=0').reply(404, "fail");
            try {
                await mainAllEmployees(config);
                expect(false).toStrictEqual(true);
            } catch(e) {
                expect(e).toStrictEqual("Can not fetch paylocity data");
            }
        });
    });

    describe('When sendGetRequest succeeds but is missing total employee count', () => {
        it('should throw "Total employee count missing from paylocity data"', async () => {
            process.env = {
                ...process.env,
                "domain": "fakeDomain",
                "clientId": "fakeClientId",
                "clientSecret": "fakeClientSecret"
            }
            mock.onPost('fakeDomain/IdentityServer/connect/token').reply(200, { access_token: "fakeAccessToken" });
            mock.onGet('fakeDomain/api/v2/companies/undefined/employees?pagesize=1&pagenumber=0').reply(200, { data: "fakeData" }, {});
            try {
                await mainAllEmployees(config);
                expect(false).toStrictEqual(true);
            } catch(e) {
                expect(e).toStrictEqual("Total employee count missing from paylocity data");
            }
        });
    });

    describe('When sendGetRequest contains the total employee count and but main fails', () => {
        it('should throw "Can not fetch paylocity data"', async () => {
            config = {
                "Function": "getEmployee",
                "Tokenize": [],
                "Parameters": {
                    "employee": "all"
                },
                "Export": "false"
            };
            process.env = {
                ...process.env,
                "domain": "fakeDomain",
                "clientId": "fakeClientId",
                "clientSecret": "fakeClientSecret"
            }
            mock.onPost('fakeDomain/IdentityServer/connect/token').reply(200, { access_token: "fakeAccessToken" });
            mock.onGet('fakeDomain/api/v2/companies/undefined/employees?pagesize=1&pagenumber=0').reply(200, [ { employeeId: 1 } ], { "x-pcty-total-count": 1 });
            try {
                await mainAllEmployees(config);
                expect(false).toStrictEqual(true);
            } catch(e) {
                expect(e).toStrictEqual("Can not fetch paylocity data");
            }
        });
    });

    describe('When sendGetRequest contains the total employee count and but main fails', () => {
        it('should throw "Can not fetch paylocity data"', async () => {
            config = {
                "Function": "getEmployee",
                "Tokenize": [],
                "Parameters": {
                    "employee": "all"
                },
                "Export": "false"
            };
            process.env = {
                ...process.env,
                "domain": "fakeDomain",
                "clientId": "fakeClientId",
                "clientSecret": "fakeClientSecret"
            }
            mock.onPost('fakeDomain/IdentityServer/connect/token').reply(200, { access_token: "fakeAccessToken" });
            mock.onGet('fakeDomain/api/v2/companies/undefined/employees?pagesize=1&pagenumber=0').reply(200, [ { employeeId: 1 } ], { "x-pcty-total-count": 1 });
            try {
                await mainAllEmployees(config);
                expect(false).toStrictEqual(true);
            } catch(e) {
                expect(e).toStrictEqual("Can not fetch paylocity data");
            }
        });
    });

    describe('When mainAllEmployees(config) succeeds', () => {
        it('should return properly tokenized values for all employees', async () => {
            config = {
                "Function": "getEmployee",
                "Tokenize": [],
                "Parameters": {
                    "employee": "all"
                },
                "Export": "false"
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
            mock.onGet('fakeDomain/api/v2/companies/undefined/employees?pagesize=1&pagenumber=0').reply(200, [ { employeeId: 1 } ], { "x-pcty-total-count": 1 });
            mock.onGet('fakeDomain/api/v2/companies/undefined/employees/1').reply(200, [{ "employeeData": "fakeEmployeeData" }]);
            response = await mainAllEmployees(config);
            expect(JSON.stringify(response)).toStrictEqual(JSON.stringify({ "1": [{ "employeeData": "fakeEmployeeData" }] }));
        });
    });

});