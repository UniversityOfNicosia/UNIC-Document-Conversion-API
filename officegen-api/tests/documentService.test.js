const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { createDocumentWithStructure, createDocumentBuffer } = require('../src/documentLibrary');
const { createDocxWithStructure } = require('../src/utils/officegenHelper');

const outDir = path.join(__dirname, '../tests_output/');

// Helper to ensure the output directory exists
beforeAll(async () => {
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
      // Add a table element example if applicable
    ];
    const styles = {
      textColor: '#000000',
      fontFamily: {
        body: 'Calibri',
        title: 'Arial',
        subtitle: 'Times New Roman'
      }
    };
    const outputPath = path.join(outDir, 'testDocument.docx');
    await createDocxWithStructure(elements, styles, outputPath);

    // Verify the document is created
    assert(fs.existsSync(outputPath), 'The document should exist');
  });

  it('generates a document buffer with content', async () => {
    const elements = [
      { type: 'paragraph', text: 'Paragraph with buffer' }
    ];
    const styles = {};

    const buffer = await createDocumentBuffer(elements, styles);
    assert(buffer instanceof Buffer, 'Should return a buffer');
    assert(buffer.length > 0, 'Buffer should not be empty');
  });

  
    it('creates a document with a table', async () => {
      const elements = [
        { type: 'title', text: 'Document with Table' },
        {
          type: 'table',
          table: [
            // Define the table header
            [
              { val: "Header 1", opts: { b: true, sz: '24', shd: { fill: "cccccc" } } },
              { val: "Header 2", opts: { b: true, sz: '24', shd: { fill: "cccccc" } } }
            ],
            // Define a few rows of content
            [ "Row 1, Cell 1", "Row 1, Cell 2" ],
            [ "Row 2, Cell 1", "Row 2, Cell 2" ]
          ],
          tableStyle: {
            tableColWidth: 4261,
            tableSize: 24,
            tableColor: "ada",
            tableAlign: "left",
            tableFontFamily: "Comic Sans MS"
          }
        }
      ];
      const styles = {
        textColor: '#000000',
        fontFamily: {
          body: 'Calibri',
          title: 'Arial'
        }
      };
      const outputPath = path.join(outDir, 'testDocumentWithTable.docx');
      await createDocxWithStructure(elements, styles, outputPath);
  
      // Verify the document is created
      assert(fs.existsSync(outputPath), 'The document with a table should exist');
    });
  
});

