const express = require('express');
const presentationManager = require('./lib/presentationManager');

const app = express();
app.use(express.json());

app.post('/create-presentation', async (req, res) => {
  if (!req.body.slides) {
    return res.status(400).send({ message: 'Slides are required.' });
  }
  try {
    const buffer = await presentationManager.createPresentationWithStructure(req.body.slides, req.body.styles);
    res.setHeader('Content-Disposition', 'attachment; filename=presentation.pptx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.send(buffer);
  } catch (error) {
    console.error('Failed to create presentation:', error);
    res.status(500).send({ message: 'Failed to create presentation due to an internal error.' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
