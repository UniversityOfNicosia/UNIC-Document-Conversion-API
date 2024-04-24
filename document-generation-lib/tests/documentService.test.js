const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { createDocumentBuffer } = require("../src/documentLibrary");
const { createDocxWithStructure } = require("../src/utils/officegenHelper");

// Directory for test outputs
const outDir = path.join(__dirname, "./tests_out/");

// Ensure the output directory exists before running tests
beforeAll(() => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
});

// Main test suite for document generator functionalities
describe("Document Gen API Tests", () => {

  // Test for creating a document with mixed content types
  it("should create a document with titles, text, and code blocks", async () => {
    const elements = [
      { type: "title", text: "Document Title" },
      { type: "subtitle", text: "Subtitle here" },
      { type: "text", text: "Some basic text" },
      { type: "codeBlock", text: 'console.log("Hello, world!");' },
    ];
    const styles = {
      textColor: "#000000",
      fontFamily: {
        body: "Calibri",
        title: "Arial",
        subtitle: "Times New Roman",
      },
    };
    const outputPath = path.join(outDir, "testDocument.docx");

    await createDocxWithStructure(elements, styles, outputPath);

    // Verify document creation
    assert(fs.existsSync(outputPath), "Document should be successfully created");
  });

  // Test for generating a document buffer
  it("should generate a buffer for a document with paragraph content", async () => {
    const elements = [{ type: "paragraph", text: "Paragraph within a buffer" }];
    const buffer = await createDocumentBuffer(elements, {});

    // Buffer validations
    assert(buffer instanceof Buffer, "Should return a valid buffer");
    assert(buffer.length > 0, "Generated buffer should not be empty");
  });

  // Test for creating a document with a table
  it("should create a document with a table", async () => {
    const elements = [
      { type: "title", text: "Document with Table" },
      {
        type: "table",
        table: [
          // Table header
          [
            { val: "Header 1", opts: { b: true, sz: "24", shd: { fill: "cccccc" } }},
            { val: "Header 2", opts: { b: true, sz: "24", shd: { fill: "cccccc" } }},
          ],
          // Table rows
          ["Row 1, Cell 1", "Row 1, Cell 2"],
          ["Row 2, Cell 1", "Row 2, Cell 2"],
        ],
        tableStyle: {
          tableColWidth: 4261,
          tableSize: 24,
          tableColor: "ada",
          tableAlign: "left",
          tableFontFamily: "Comic Sans MS",
        },
      },
    ];
    const styles = {
      textColor: "#000000",
      fontFamily: {
        body: "Calibri",
        title: "Arial",
      },
    };
    const outputPath = path.join(outDir, "testDocumentWithTable.docx");

    await createDocxWithStructure(elements, styles, outputPath);

    // Verify table document creation
    assert(fs.existsSync(outputPath), "Document with a table should be successfully created");
  });

});
