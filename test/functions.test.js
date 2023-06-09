const getFunction = require("../utils/functions").getFunction;

let config;
let functionCall;

describe("TESTING getFunction(config)", () => {

    describe('When config.Function is undefined', () => {
        it('should throw "Exception: undefined is not a valid function name"', () => {
            config = {};
            functionCall = () => { getFunction(config) };
            expect(functionCall).toThrow("Exception: undefined is not a valid function name");
        });
    });

    describe('When config.Function is "invalidFunction", which is not a valid function name', () => {
        it('should throw "Exception: invalidFunction is not a valid function name"', () => {
            config = {
                "Function": "invalidFunction"
            };
            functionCall = () => { getFunction(config) };
            expect(functionCall).toThrow("Exception: invalidFunction is not a valid function name");
        });
    });

    describe('When config.Function is "getPayStatementSummaryByYear"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee,year required"', () => {
                config = {
                    "Function": "getPayStatementSummaryByYear"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) employee,year required");
            });
        });

        describe("When Parameter employee is missing", () => {
            it('should throw "Exception: Parameters must include employee"', () => {
                config = {
                    "Function": "getPayStatementSummaryByYear",
                    "Parameters": {
                        "year": "fakeYear"
                    }
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameters must include employee");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees/fakeEmployee/paystatement/summary/fakeEmployee', () => {
                config = {
                    "Function": "getPayStatementSummaryByYear",
                    "Parameters": {
                        "year": "fakeYear",
                        "employee": "fakeEmployee"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees/fakeEmployee/paystatement/summary/fakeYear");
            });
        });

    });

    describe('When config.Function is "getPayStatementSummaryByYearAndDate"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee,year,date required"', () => {
                config = {
                    "Function": "getPayStatementSummaryByYearAndDate"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) employee,year,date required");
            });
        });

        describe("When Parameter date is missing", () => {
            it('should throw "Exception: Parameters must include date"', () => {
                config = {
                    "Function": "getPayStatementSummaryByYearAndDate",
                    "Parameters": {
                        "year": "fakeYear",
                        "employee": "fakeEmployee"
                    }
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameters must include date");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees/fakeEmployee/paystatement/summary/fakeEmployee/fakeDate', () => {
                config = {
                    "Function": "getPayStatementSummaryByYearAndDate",
                    "Parameters": {
                        "year": "fakeYear",
                        "employee": "fakeEmployee",
                        "date": "fakeDate"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees/fakeEmployee/paystatement/summary/fakeYear/fakeDate");
            });
        });

    });

    describe('When config.Function is "getPayStatementDetailsByYear"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee,year required"', () => {
                config = {
                    "Function": "getPayStatementDetailsByYear"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) employee,year required");
            });
        });

        describe("When Parameter employee is missing", () => {
            it('should throw "Exception: Parameters must include employee"', () => {
                config = {
                    "Function": "getPayStatementDetailsByYear",
                    "Parameters": {
                        "year": "fakeYear"
                    }
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameters must include employee");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees/fakeEmployee/paystatement/details/fakeEmployee', () => {
                config = {
                    "Function": "getPayStatementDetailsByYear",
                    "Parameters": {
                        "year": "fakeYear",
                        "employee": "fakeEmployee"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees/fakeEmployee/paystatement/details/fakeYear");
            });
        });

    });

    describe('When config.Function is "getPayStatementDetailsByYearAndDate"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee,year,date required"', () => {
                config = {
                    "Function": "getPayStatementDetailsByYearAndDate"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) employee,year,date required");
            });
        });

        describe("When Parameter date is missing", () => {
            it('should throw "Exception: Parameters must include date"', () => {
                config = {
                    "Function": "getPayStatementDetailsByYearAndDate",
                    "Parameters": {
                        "year": "fakeYear",
                        "employee": "fakeEmployee"
                    }
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameters must include date");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees/fakeEmployee/paystatement/details/fakeEmployee/fakeDate', () => {
                config = {
                    "Function": "getPayStatementDetailsByYearAndDate",
                    "Parameters": {
                        "year": "fakeYear",
                        "employee": "fakeEmployee",
                        "date": "fakeDate"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees/fakeEmployee/paystatement/details/fakeYear/fakeDate");
            });
        });

    });

    describe('When config.Function is "getEmployee"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee required"', () => {
                config = {
                    "Function": "getEmployee"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) employee required");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees/fakeEmployee', () => {
                config = {
                    "Function": "getEmployee",
                    "Parameters": {
                        "employee": "fakeEmployee"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees/fakeEmployee");
            });
        });

    });

    describe('When config.Function is "getEmployeeIds"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee,year required"', () => {
                config = {
                    "Function": "getEmployeeIds"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) pageSize,pageNumber required");
            });
        });

        describe("When Parameter pageSize is missing", () => {
            it('should throw "Exception: Parameters must include employee"', () => {
                config = {
                    "Function": "getEmployeeIds",
                    "Parameters": {
                        "pageNumber": "fakePageNumber"
                    }
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameters must include pageSize");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees?pagesize=fakePageSize&pagenumber=fakePageNumber', () => {
                config = {
                    "Function": "getEmployeeIds",
                    "Parameters": {
                        "pageSize": "fakePageSize",
                        "pageNumber": "fakePageNumber"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees?pagesize=fakePageSize&pagenumber=fakePageNumber");
            });
        });

    });

    describe('When config.Function is "getCompanyCodes"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) codeResource required"', () => {
                config = {
                    "Function": "getCompanyCodes"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) codeResource required");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/codes/fakeCodeResource', () => {
                config = {
                    "Function": "getCompanyCodes",
                    "Parameters": {
                        "codeResource": "fakeCodeResource"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/codes/fakeCodeResource");
            });
        });

    });

    describe('When config.Function is "getCompanySpecificSchema"', () => {
        it('should return /api/v2/companies/undefined/openapi', () => {
            config = {
                "Function": "getCompanySpecificSchema",
            }
            functionCall = getFunction(config);
            expect(functionCall).toStrictEqual("/api/v2/companies/undefined/openapi");
        });
    });

    describe('When config.Function is "getCustomFields"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) category required"', () => {
                config = {
                    "Function": "getCustomFields"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) category required");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/customfields/fakeCategory', () => {
                config = {
                    "Function": "getCustomFields",
                    "Parameters": {
                        "category": "fakeCategory"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/customfields/fakeCategory");
            });
        });

    });

    describe('When config.Function is "getDirectDeposit"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee required"', () => {
                config = {
                    "Function": "getDirectDeposit"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) employee required");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees/fakeEmployee/directDeposit', () => {
                config = {
                    "Function": "getDirectDeposit",
                    "Parameters": {
                        "employee": "fakeEmployee"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees/fakeEmployee/directDeposit");
            });
        });

    });

    describe('When config.Function is "getEarnings"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee required"', () => {
                config = {
                    "Function": "getEarnings"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) employee required");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees/fakeEmployee/earnings', () => {
                config = {
                    "Function": "getEarnings",
                    "Parameters": {
                        "employee": "fakeEmployee"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees/fakeEmployee/earnings");
            });
        });

    });

    describe('When config.Function is "getEarningsByEarningCode"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee,year required"', () => {
                config = {
                    "Function": "getEarningsByEarningCode"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) employee,earningCode required");
            });
        });

        describe("When Parameter employee is missing", () => {
            it('should throw "Exception: Parameters must include employee"', () => {
                config = {
                    "Function": "getEarningsByEarningCode",
                    "Parameters": {
                        "earningCode": "fakeEarningCode"
                    }
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameters must include employee");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees/fakeEmployee/earnings/fakeEarningCode', () => {
                config = {
                    "Function": "getEarningsByEarningCode",
                    "Parameters": {
                        "earningCode": "fakeEarningCode",
                        "employee": "fakeEmployee"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees/fakeEmployee/earnings/fakeEarningCode");
            });
        });

    });

    describe('When config.Function is "getEarningsByEarningCodeAndStartDate"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee,year,startDate required"', () => {
                config = {
                    "Function": "getEarningsByEarningCodeAndStartDate"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) employee,earningCode,startDate required");
            });
        });

        describe("When Parameter startDate is missing", () => {
            it('should throw "Exception: Parameters must include startDate"', () => {
                config = {
                    "Function": "getEarningsByEarningCodeAndStartDate",
                    "Parameters": {
                        "earningCode": "fakeEarningCode",
                        "employee": "fakeEmployee"
                    }
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameters must include startDate");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees/fakeEmployee/earnings/fakeEarningCode/fakeStartDate', () => {
                config = {
                    "Function": "getEarningsByEarningCodeAndStartDate",
                    "Parameters": {
                        "earningCode": "fakeEarningCode",
                        "employee": "fakeEmployee",
                        "startDate": "fakeStartDate"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees/fakeEmployee/earnings/fakeEarningCode/fakeStartDate");
            });
        });

    });

    describe('When config.Function is "getAllLocalTaxes"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee required"', () => {
                config = {
                    "Function": "getAllLocalTaxes"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) employee required");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees/fakeEmployee/localTaxes', () => {
                config = {
                    "Function": "getAllLocalTaxes",
                    "Parameters": {
                        "employee": "fakeEmployee"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees/fakeEmployee/localTaxes");
            });
        });

    });

    describe('When config.Function is "getLocalTaxesByTaxCode"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee,taxCode required"', () => {
                config = {
                    "Function": "getLocalTaxesByTaxCode"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) employee,taxCode required");
            });
        });

        describe("When Parameter employee is missing", () => {
            it('should throw "Exception: Parameters must include employee"', () => {
                config = {
                    "Function": "getLocalTaxesByTaxCode",
                    "Parameters": {
                        "taxCode": "fakeTaxCode"
                    }
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameters must include employee");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees/fakeEmployee/localTaxes/fakeTaxCode', () => {
                config = {
                    "Function": "getLocalTaxesByTaxCode",
                    "Parameters": {
                        "taxCode": "fakeTaxCode",
                        "employee": "fakeEmployee"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees/fakeEmployee/localTaxes/fakeTaxCode");
            });
        });

    });

    describe('When config.Function is "getSensitiveData"', () => {

        describe("When all required Parameters are missing", () => {
            it('should throw "Exception: Parameter(s) employee required"', () => {
                config = {
                    "Function": "getSensitiveData"
                }
                functionCall = () => { getFunction(config) };
                expect(functionCall).toThrow("Exception: Parameter(s) employee required");
            });
        });

        describe("When config includes all necessary Parameters", () => {
            it('should return /api/v2/companies/undefined/employees/fakeEmployee/localTaxes', () => {
                config = {
                    "Function": "getSensitiveData",
                    "Parameters": {
                        "employee": "fakeEmployee"
                    }
                }
                functionCall = getFunction(config);
                expect(functionCall).toStrictEqual("/api/v2/companies/undefined/employees/fakeEmployee/sensitivedata");
            });
        });

    });

})