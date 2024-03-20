const officegen = require('officegen');
const fs = require('fs');
const path = require('path');

// Function to create a DOCX file with basic text input
exports.createDocxWithText = async (text, outputPath = 'output.docx') => {
  return new Promise((resolve, reject) => {
    const docx = officegen({
      type: 'docx',
      orientation: 'portrait',
    });

    docx.on('error', (err) => {
      console.error('officegen error:', err);
      reject(err);
    });

    // Add a paragraph with the provided text
    const pObj = docx.createP();
    pObj.addText(text);

    // Define the output stream
    const out = fs.createWriteStream(path.join(__dirname, '..', '..', 'examples', outputPath));

    out.on('error', (err) => {
      console.error('File stream error:', err);
      reject(err);
    });

    out.on('close', () => {
      console.log(`${outputPath} has been created.`);
      resolve(outputPath);
    });

    // Generate the document
    docx.generate(out);
  });
};
