const express = require('express');
const app = express();

const main = require('./utils');

app.use(express.urlencoded({extended: true}));
app.use(express.text());

const PORT = parseInt(process.env.PORT) || 3000;

app.post('/*', async (req, res) => {
    const response = await main((JSON.parse(req.body)));
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});