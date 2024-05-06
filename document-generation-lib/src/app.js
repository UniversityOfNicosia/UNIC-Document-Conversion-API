const express = require('express');
const documentManager = require('./lib/documentManager')

const app = express();
app.use(express.json());

router.post('/create-document', async (req, res) => {
  try {
    const resultPath = await documentManager.createDocumentWithStructure(req.body.elements, req.body.styles);
    res.status(201).send({ message: 'Document created successfully.', path: resultPath });
  } catch (error) {
    console.error('Failed to create document:', error);
    res.status(500).send({ message: 'Failed to create document due to an internal error.' });
  }
});

router.post('/create-document/buffer', async (req, res) => {
  try {
    const buffer = await documentManager.createDocumentBuffer(req.body.elements, req.body.styles);
    res.setHeader('Content-Disposition', 'attachment; filename=document.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    console.error('Failed to create document:', error);
    res.status(500).send({ message: 'Failed to create document due to an internal error.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
