const express = require('express');
const documentLibrary = require('./documentLibrary');

const app = express();
app.use(express.json());

app.post('/api/document-generation', async (req, res) => {
  try {
    const resultPath = await documentLibrary.createDocumentWithStructure(req.body.elements, req.body.styles);
    res.status(201).send({ message: 'Document created successfully.', path: resultPath });
  } catch (error) {
    console.error('Failed to create document:', error);
    res.status(500).send({ message: 'Failed to create document due to an internal error.' });
  }
});

app.post('/api/document-generation/buffer', async (req, res) => {
  try {
    const buffer = await documentLibrary.createDocumentBuffer(req.body.elements, req.body.styles);
    res.setHeader('Content-Disposition', 'attachment; filename=document.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    console.error('Failed to create document:', error);
    res.status(500).send({ message: 'Failed to create document due to an internal error.' });
  }
});

app.use((req, res) => {
  console.error(`404 Request URL: ${req.originalUrl} - IP: ${req.ip}`);

  const availableRoutes = [
    { method: 'POST', path: '/api/document-generation', description: 'Create a document file.' },
    { method: 'POST', path: '/api/document-generation/buffer', description: 'Create a document file and return it as a buffer.' },
  ];

  res.status(404).send({ message: 'Route not found.', availableRoutes });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
