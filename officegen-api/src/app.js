const express = require('express');
const documentRouter = require('./controllers/documentController');

function createServer() {
    const app = express();
    app.use(express.json());
    app.use('/api', documentRouter);
    return app;
}

module.exports = { createServer };
