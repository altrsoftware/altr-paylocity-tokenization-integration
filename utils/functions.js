const company = process.env.company;

const FUNCTIONS = {
    /**
     * Generates a URL path for retrieiving pay statement summary with employee and year parameters
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.employee The employee ID which is being queried
     * @param {string} obj.year The year which is being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getPayStatementSummaryByYear: ({employee, year}) => `/api/v2/companies/${company}/employees/${employee}/paystatement/summary/${year}`,
    /**
     * Generates a URL path for retrieiving pay statement summary with employee, year, and date parameters
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.employee The employee ID which is being queried
     * @param {string} obj.year The year which is being queried
     * @param {string} obj.date The date which is being queried, formats: MM-DD-CCYY, CCYY-MM-DD
     * @returns {string} The URL path to be attached to the domain from env
     */
    getPayStatementSummaryByYearAndDate: ({employee, year, date}) => `/api/v2/companies/${company}/employees/${employee}/paystatement/summary/${year}/${date}`,
    /**
     * Generates a URL path for retrieiving pay statement details with employee, and year parameters
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.employee The employee ID which is being queried
     * @param {string} obj.year The year which is being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getPayStatementDetailsByYear: ({employee, year}) => `/api/v2/companies/${company}/employees/${employee}/paystatement/details/${year}`,
    /**
     * Generates a URL path for retrieiving pay statement details with employee, year, and date parameters
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.employee The employee ID which is being queried
     * @param {string} obj.year The year which is being queried
     * @param {string} obj.date The date which is being queried, formats: MM-DD-CCYY, CCYY-MM-DD
     * @returns {string} The URL path to be attached to the domain from env
     */
    getPayStatementDetailsByYearAndDate: ({employee, year, date}) => `/api/v2/companies/${company}/employees/${employee}/paystatement/details/${year}/${date}`,
    /**
     * Generates a URL path for retrieiving employee information
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.employee The employee ID which is being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getEmployee: ({employee}) => `/api/v2/companies/${company}/employees/${employee}`,
    /**
     * Generates a URL path for retrieiving employee IDs
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.pageSize The size of the page being queried
     * @param {string} obj.pageNumber The number of the page being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getEmployeeIds: ({pageSize, pageNumber}) => `/api/v2/companies/${company}/employees?pagesize=${pageSize}&pagenumber=${pageNumber}`,
    /**
     * Generates a URL path for retrieiving company codes
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.codeResource The code resource which is being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getCompanyCodes: ({codeResource}) => `/api/v2/companies/${company}/codes/${codeResource}`,
    /**
     * Generates a URL path for retrieiving the company specific schema
     * @returns {string} The URL path to be attached to the domain from env
     */
    getCompanySpecificSchema: () => `/api/v2/companies/${company}/openapi`,
    /**
     * Generates a URL path for retrieiving custom fields
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.category The category which is being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getCustomFields: ({category}) => `/api/v2/companies/${company}/customfields/${category}`,
    /**
     * Generates a URL path for retrieiving employee direct deposit
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.employee The employee which is being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getDirectDeposit: ({employee}) => `/api/v2/companies/${company}/employees/${employee}/directDeposit`,
    /**
     * Generates a URL path for retrieiving employee earnings
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.employee The employee which is being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getEarnings: ({employee}) => `/api/v2/companies/${company}/employees/${employee}/earnings`,
    /**
     * Generates a URL path for retrieiving employee earnings by earning code
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.employee The employee which is being queried
     * @param {string} obj.earningCode The earning code which is being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getEarningsByEarningCode: ({employee, earningCode}) => `/api/v2/companies/${company}/employees/${employee}/earnings/${earningCode}`,
    /**
     * Generates a URL path for retrieiving employee earnings by earning code
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.employee The employee which is being queried
     * @param {string} obj.earningCode The earning code which is being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getEarningsByEarningCodeAndStartDate: ({employee, earningCode, startDate}) => `/api/v2/companies/${company}/employees/${employee}/earnings/${earningCode}/${startDate}`,
    /**
     * Generates a URL path for retrieiving employee local taxes
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.employee The employee which is being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getAllLocalTaxes: ({employee}) => `/api/v2/companies/${company}/employees/${employee}/localTaxes`,
    /**
     * Generates a URL path for retrieiving employee local taxes by taxCode
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.employee The employee which is being queried
     * @param {string} obj.taxCode The taxCode which is being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getLocalTaxesByTaxCode: ({employee, taxCode}) => `/api/v2/companies/${company}/employees/${employee}/localTaxes/${taxCode}`,
    /**
     * Generates a URL path for retrieiving employee sensitive data
     * @param {Object} obj An object containing the necessary parameters
     * @param {string} obj.employee The employee which is being queried
     * @returns {string} The URL path to be attached to the domain from env
     */
    getSensitiveData: ({employee}) => `/api/v2/companies/${company}/employees/${employee}/sensitivedata`,
};

FUNCTIONS.getPayStatementSummaryByYear.required = ["employee", "year"];
FUNCTIONS.getPayStatementSummaryByYearAndDate.required = ["employee", "year", "date"];
FUNCTIONS.getPayStatementDetailsByYear.required = ["employee", "year"];
FUNCTIONS.getPayStatementDetailsByYearAndDate.required = ["employee", "year", "date"];
FUNCTIONS.getEmployee.required = ["employee"];
FUNCTIONS.getEmployeeIds.required = ["pageSize", "pageNumber"];
FUNCTIONS.getCompanyCodes.required = ["codeResource"]
FUNCTIONS.getCompanySpecificSchema.required = [];
FUNCTIONS.getCustomFields.required = ["category"];
FUNCTIONS.getDirectDeposit.required = ["employee"];
FUNCTIONS.getEarnings.required = ["employee"];
FUNCTIONS.getEarningsByEarningCode.required = ["employee", "earningCode"];
FUNCTIONS.getEarningsByEarningCodeAndStartDate.required = ["employee", "earningCode", "startDate"];
FUNCTIONS.getAllLocalTaxes.required = ["employee"];
FUNCTIONS.getLocalTaxesByTaxCode.required = ["employee", "taxCode"];
FUNCTIONS.getSensitiveData.required = ["employee"];

/**
 * Generates a URL path for the function requested and included parameters, after checking for valid parameters
 * @param {Object} config The body of a config request sent to the server
 * @returns {string} The URL path to be attached to the domain from env
 */
const getFunction = (config) => {
    const _function = config?.Function;
    if(!_function || !FUNCTIONS[_function]) throw (`${_function} is not a valid function name`);
    const params = config?.Parameters;
    if(!params && FUNCTIONS[_function].required.length !== 0) throw (`Parameter(s) ${FUNCTIONS[_function].required} required`)
    for(param in FUNCTIONS[_function].required) {
        if(!(params.hasOwnProperty(FUNCTIONS[_function].required[param]))) throw (`Parameters must include ${FUNCTIONS[_function].required[param]}`);
    }
    return FUNCTIONS[_function](config.Parameters);
};

module.exports = { getFunction, FUNCTIONS };