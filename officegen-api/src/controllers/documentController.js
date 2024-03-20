const express = require('express');
const router = express.Router();
const documentService = require('../services/documentService');

// POST endpoint to create a document with text
router.post('/create-document', async (req, res) => {
  try {
    // Extract text from request body
    const { text } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).send({ message: 'Text is required' });
    }

    // Call the document service to create the document with the provided text
    const documentPath = await documentService.createDocumentWithText(text);

    // Respond with the path of the created document
    res.status(201).send({ message: 'Document created successfully', path: documentPath });
  } catch (error) {
    console.error('Failed to create document:', error);
    res.status(500).send({ message: 'Failed to create document' });
  }
});

module.exports = router;
