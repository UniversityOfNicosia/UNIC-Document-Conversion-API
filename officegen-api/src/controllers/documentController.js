const express = require('express');
const router = express.Router();
const documentService = require('../services/documentService');

// POST endpoint to create a document with document elements 
router.post('/create-document', async (req, res) => {
  try {
    const { documentElements  } = req.body;
    if (!documentElements ) {
      return res.status(400).send({ message: 'Document elements are required' });
    }
    const documentPath = await documentService.createDocumentWithText(documentElements);
    res.status(201).send({ message: 'Document created successfully', path: documentPath });
  } catch (error) {
    console.error('Failed to create document:', error);
    res.status(500).send({ message: 'Failed to create document' });
  }
});

module.exports = router;
