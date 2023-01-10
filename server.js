const express = require('express');
const app = express();

const main = require('./utils/main');
const mainAllEmployees = require('./utils/mainAllEmployees');

app.use(express.urlencoded({extended: true}));
app.use(express.text());

const PORT = parseInt(process.env.PORT) || 3000;

app.post('/*', async (req, res) => {
    const body = JSON.parse(req.body);
    const response = body?.Parameters?.employee?.toLowerCase() === 'all' ? 
        await mainAllEmployees(body) : await main(body);
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});