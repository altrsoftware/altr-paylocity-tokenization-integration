const getFunction = require('./functions').getFunction;
const functions = require('./functions').FUNCTIONS;
const sendGetRequest = require('./sendGetRequest');
const main = require('./main');
const tokenize = require('./tokenize');
const s3Export = require('./s3Export');

/**
 * Branches between requesting information for all employees or a single employee
 * @param {Object} config An object containing request and tokenization configuration
 * @returns {Object} Key-value pairs of employeeId-Data where the data is the appropriately tokenized object response from paylocity
 */
const mainAllEmployees = async (config) => {

    if(config === undefined) throw "Exception: config is undefined";
    if(typeof config !== 'object') throw "Exception: config must be type object";
    if(Object.keys(config).length === 0) throw "Exception: config must not be empty";

    const allEmployeesConfig = {
        "Function": "getEmployeeIds",
        "Tokenize": [],
        "Parameters": {
            "pageSize": "1",
            "pageNumber": "0"
        },
        "Export": "false"
    };

    const auth = 'Bearer ' + await require('./getAuth')();

    const response = await sendGetRequest(auth, getFunction(allEmployeesConfig));
    let totalCount = response?.headers?.['x-pcty-total-count'];

    if(totalCount === undefined) throw 'Exception: Total employee count missing from paylocity data';

    let pages = [];
    while(totalCount > 0) {
        pages.push(Math.min(totalCount, 5000));
        totalCount -= 5000;
    }

    const employees = [];
    for(let pageIndex in pages) {
        allEmployeesConfig.Parameters.pageSize = pages[pageIndex];
        allEmployeesConfig.Parameters.pageNumber = pageIndex;
        const employeesRequest = await sendGetRequest(auth, getFunction(allEmployeesConfig));
        employees.push(...employeesRequest.data);
    }

    const tmpExport = config?.Export;
    const tmpTokenize = config?.Tokenize;
    config.Export = "false";
    config.Tokenize = [];

    const data = {};

    for(let employeeIndex in employees) {
        config.Parameters.employee = employees[employeeIndex].employeeId;
        data[employees[employeeIndex].employeeId] = await main(config);
    }

    const obj = Array.isArray(tmpTokenize) && tmpTokenize.length !== 0 ? await tokenize(data, tmpTokenize) : data;

    if(tmpExport === "true") {
        try {
            await s3Export({body: data, name: `${config.Function}-${new Date().toISOString()}.json`});
        } catch(e) {}
    }

    return obj;
}

module.exports = mainAllEmployees;