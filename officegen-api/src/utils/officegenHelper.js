const officegen = require('officegen');
const fs = require('fs');
const path = require('path');

// Function to create a DOCX file with structured elements
exports.createDocxWithStructure = async (elements, outputPath = 'structured_document.docx') => {
  return new Promise((resolve, reject) => {
    const docx = officegen('docx');
    docx.on('error', err => reject(err));

    elements.forEach(element => {
      switch (element.type) {
        case 'title':
          let title = docx.createP({ align: 'center' });
          title.addText(element.text, { bold: true, font_size: 22 });
          break;
        case 'subtitle':
          let subtitle = docx.createP({ align: 'center' });
          subtitle.addText(element.text, { bold: true, font_size: 18 });
          break;
        case 'paragraph':
          let para = docx.createP();
          para.addText(element.text);
          break;
        case 'bullet':
          element.items.forEach(item => {
            let bullet = docx.createListOfDots();
            bullet.addText(item);
          });
          break;
        case 'list':
          element.items.forEach(item => {
            let list = docx.createListOfNumbers();
            list.addText(item);
          });
          break;
        case 'footnotes':
          let footnotes = docx.createP();
          footnotes.addText(element.text, { font_size: 10 });
          break;
        default:
          console.log(`Unsupported element type: ${element.type}`);
      }
    });

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
