const officegen = require('officegen');
const streamBuffers = require('stream-buffers');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to download an image from a URL and return the path
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const imagePath = path.resolve(__dirname, "downloaded_image.png");
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: Status code ${response.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(imagePath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => {
          resolve(imagePath);
        });
      });
      fileStream.on('error', (err) => {
        fs.unlink(imagePath, () => reject(err));
      });
    }).on('error', (err) => {
      console.error('Failed to download image:', err);
      reject(err);
    });
  });
}

// Function to apply elements and styles to a DOCX document
function applyElementsAndStyles(docx, elements, styles = {}) {
  elements.forEach(async element => {
    let options = {
      color: styles.textColor || '#000000',
      font_face: styles.fontFamily?.body || 'Calibri',
      font_size: 12
    };

    switch (element.type) {
      case 'text':
        let text = docx.createP();
        text.addText(element.text, options);
        break;
      case 'title':
        options.font_face = styles.fontFamily.title || 'Arial';
        options.font_size = 22;
        let title = docx.createP({ align: 'center' });
        title.addText(element.text, { ...options, bold: true });
        break;
      case 'subtitle':
        options.font_face = styles.fontFamily.subtitle || 'Times New Roman';
        options.font_size = 18;
        let subtitle = docx.createP({ align: 'center' });
        subtitle.addText(element.text, { ...options, bold: true });
        break;
      case 'paragraph':
        let para = docx.createP();
        para.addText(element.text, options);
        break;
      case 'bullet':
        element.items.forEach(item => {
          let bullet = docx.createListOfDots();
          bullet.addText(item, options);
        });
        break;
      case 'list':
        element.items.forEach(item => {
          let list = docx.createListOfNumbers();
          list.addText(item, options);
        });
        break;
      case 'footnotes':
        let footnote = docx.createP();
        footnote.addText(element.text, { ...options, italic: true});
        break;
      case 'codeBlock':
        let codeBlock = docx.createP();
        codeBlock.addText(element.text, { font_face: 'Courier New', font_size: 10 });
        break;
      case 'table':
        docx.createTable(element.table, element.tableStyle);
        break;
      case 'image':
        const imageParagraph = docx.createP();
        try {
          const imagePath = await downloadImage(element.src);
          
          imageParagraph.addImage(imagePath, element.options);
          console.log(`Added image from ${element.src}`);
        } catch (err) {
          console.error(`Error adding image to document: ${err.message}`);
        }
        break;
      case 'pageBreak':
        docx.putPageBreak();
        break;
      case 'horizontalLine':
        let lineParagraph = docx.createP();
        lineParagraph.addHorizontalLine();
        break;
      default:
        console.warn(`Unsupported element type: ${element.type}`);
        let unsupported = docx.createP();
        unsupported.addText(element.text, options);
        break;
    }
  });
}

// Function to create a DOCX file with structured elements
exports.createDocxWithStructure = async (elements, styles, outputPath = 'document.docx') => {
  return new Promise((resolve, reject) => {
    const docx = officegen('docx');
    docx.on('error', err => reject(err));

    // Set the document styles
    applyElementsAndStyles(docx, elements, styles);

    // Define the output stream
    const out = fs.createWriteStream(outputPath);
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

// Function to create a DOCX file and return it as a buffer
exports.createDocxBuffer = async (elements, styles) => {
  return new Promise((resolve, reject) => {
    const docx = officegen('docx');
    docx.on('error', err => reject(err));

    // Apply elements and styles
    applyElementsAndStyles(docx, elements, styles);

    const bufferStream = new streamBuffers.WritableStreamBuffer({
      initialSize: (100 * 1024), // Start at 100 kilobytes.
      incrementAmount: (10 * 1024) // Grow by 10 kilobytes each time buffer overflows.
    });

    docx.generate(bufferStream);

    bufferStream.on('finish', () => {
      const buffer = bufferStream.getContents();
      resolve(buffer);
    });

    bufferStream.on('error', (err) => {
      console.error('Buffer stream error:', err);
      reject(err);
    });
  });
};