const getFunction = require('./functions').getFunction;
const sendGetRequest = require('./sendGetRequest');
const main = require('./main');
const tokenize = require('./tokenize');
const s3Export = require('./s3Export');

function findKeyPath(o, s) {

    let result = [];

    function search(obj, key, path) {
        for (let k in obj) {
            if (key.includes(k)) {
                result.push([...path, k]);
            }
            if (typeof obj[k] === "object") {
                search(obj[k], key, [...path, k]);
            }
        }
    }
  
    search(o, s, []);
    return result;

}

async function toTokens(data, tokenizeKeys) {

    if(typeof data !== "object") throw "Data must be type Object";
    if(!Array.isArray(tokenizeKeys)) throw "Keys to tokenize must be type Array";

    const pathArray = findKeyPath(data, tokenizeKeys);
    let flatObj = {};
    
    pathArray.forEach(path => {
        let current = data;
        for (let i = 0; i < path.length; i++) {
            const key = path[i];
            current = current[key];
        }
        flatObj[path.join(".")] = current;
    });
    
    try {
        flatObj = await tokenize(flatObj);
    } catch(e) {
        Object.keys(flatObj).forEach(key => {
            flatObj[key] = "tokenization failed"; //JSON.parse(JSON.stringify(e))// "tokenization failed";
        })
    }
  
    const newObj = JSON.parse(JSON.stringify(data));
    Object.entries(flatObj).forEach(([path, value]) => {
        let current = newObj;
        const pathArray = path.split(".");
        for (let i = 0; i < pathArray.length - 1; i++) {
            const key = pathArray[i];
            current = current[key];
        }
        current[pathArray[pathArray.length - 1]] = value;
    });
  
    return newObj;

}

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
    const tmpTokenize = config?.Tokenize;
    config.Export = "false";

    const data = {};

    // let employeeInit = config?.Parameters?.pageSize ?? 0 * config?.Parameters?.pageNum ?? 0;

    for(let employeeIndex in employees) {
        if(employeeIndex > 10) break;
        console.log(employeeIndex);
        config.Parameters.employee = employees[employeeIndex].employeeId;
        config.Tokenize = [];
        data[employees[employeeIndex].employeeId] = await main(config);
    }

    const obj = tmpTokenize.length !== 0 ? await toTokens(data, tmpTokenize, tokenize) : data;

    if(tmpExport === "true") {
        try {
            await s3Export({body: data, name: `${config.Function}-${new Date().toISOString()}.json`});
        } catch(e) {}
    }

    return obj;
}

module.exports = mainAllEmployees;