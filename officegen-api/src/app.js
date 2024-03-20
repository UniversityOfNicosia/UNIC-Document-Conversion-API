const express = require('express');
const documentController = require('./controllers/documentController');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/convert', documentController.convertDocument);

app.listen(port, () => {
  console.log(`Officegen API listening at http://localhost:${port}`);
});

module.exports = app;
