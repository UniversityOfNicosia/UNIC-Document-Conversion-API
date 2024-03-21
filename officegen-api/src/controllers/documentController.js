const express = require('express');
const router = express.Router();
const documentService = require('../services/documentService');

// POST endpoint to create a document with structured elements
router.post('/create-document', async (req, res) => {
  try {
    const { documentElements, documentStyles } = req.body;
    if (!documentElements) {
      return res.status(400).send({ message: 'Document elements are required.' });
    }
    // Optional: Validate the presence of document styles
    // if (!documentStyles) {
    //   return res.status(400).send({ message: 'Document styles are required.' });
    // }
    const documentPath = await documentService.createDocumentWithStructure(documentElements, documentStyles);
    res.status(201).send({ message: 'Document created successfully.', path: documentPath });
  } catch (error) {
    console.error('Failed to create document:', error);
    res.status(500).send({ message: 'Failed to create document due to an internal error.' });
  }
});

module.exports = router;
