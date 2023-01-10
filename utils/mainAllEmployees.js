const getFunction = require('./functions');
const sendGetRequest = require('./sendGetRequest');
const main = require('./main');

/**
 * Branches between requesting information for all employees or a single employee
 * @param {Object} config An object containing request and tokenization configuration
 * @returns {Object} Key-value pairs of employeeId-Data where the data is the appropriately tokenized object response from paylocity
 */
const mainAllEmployees = async (config) => {

    if(config === undefined) throw "config is undefined";
    if(typeof config !== 'object') throw "config must be type object";
    if(Object.keys(config).length === 0) throw "config must not be empty";

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

    if(totalCount === undefined) throw 'Total employee count missing from paylocity data';

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

    const data = {};

    for(let employeeIndex in employees) {
        config.Parameters.employee = employees[employeeIndex].employeeId;
        config.Export = 'false';
        data[employees[employeeIndex].employeeId] = await main(config);
    }

    return data;
}

module.exports = mainAllEmployees;