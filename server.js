const express = require('express');
const app = express();

const main = require('./utils/main');
const mainAllEmployees = require('./utils/mainAllEmployees');
const functions = require('./utils/functions').FUNCTIONS;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const PORT = parseInt(process.env.PORT) || 3000;

app.post('/*', async (req, res) => {
    const body = JSON.parse(decodeURIComponent(encodeURI(JSON.stringify(req.body))));
    try {
        if(!functions.hasOwnProperty(body?.Function)) throw (`Exception: ${body?.Function} is not a valid function name`);
        const hasEmployeeParam = functions?.[body?.Function].required.includes('employee');
        const response = hasEmployeeParam && body?.Parameters?.employee?.toLowerCase() === 'all' ? 
            await mainAllEmployees(body) : await main(body);
        res.send(response);
    } catch(e) {
        const exceptionText = e.toString();
        if(exceptionText.startsWith("Exception: ")) res.status(400).send(exceptionText);
        else res.status(500);
    }
});

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});