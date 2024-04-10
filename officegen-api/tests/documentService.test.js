const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { createDocxWithStructure } = require('../src/utils/officegenHelper');

// Corrected output directory path:
const outDir = path.join(__dirname, 'tests_output');

// Ensure the output directory exists
beforeAll(() => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
});

describe('Document Conversion API Tests', () => {
  it('creates a document with various elements and styles', async () => {
    const elements = [
      { type: 'title', text: 'Document Title' },
      { type: 'subtitle', text: 'Subtitle here' },
      { type: 'text', text: 'Some basic text' },
      { type: 'codeBlock', text: 'console.log("Hello, world!");' },
    ];
    const styles = {
      textColor: '#000000',
      fontFamily: {
        body: 'Calibri',
        title: 'Arial',
        subtitle: 'Times New Roman'
      }
    };

    // Directly use 'outDir' for the outputPath, ensuring it points to the correct directory
    const outputPath = path.join(outDir, 'testDocument.docx');
    await createDocxWithStructure(elements, styles, outputPath);

    // Verify the document is created
    assert(fs.existsSync(outputPath), 'The document should exist');
  });
});
