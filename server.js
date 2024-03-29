const express = require('express');
const app = express();

const main = require('./utils/main');
const mainAllEmployees = require('./utils/mainAllEmployees');
const functions = require('./utils/functions').FUNCTIONS;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const PORT = parseInt(process.env.PORT) || 3000;

app.post('/*', async ({ body }, res) => {
    try {
        const hasEmployeeParam = functions?.[body?.Function].required.includes('employee');
        const response = hasEmployeeParam && body?.Parameters?.employee?.toLowerCase() === 'all' ? 
            await mainAllEmployees(body) : await main(body);
        res.send(response);
    } catch(e) {
        console.log(e);
        res.send(e);
    }
});

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});