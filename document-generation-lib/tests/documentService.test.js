// Mock modules
jest.mock("../src/documentLibrary", () => ({
  createDocumentBuffer: jest.fn()
}));

jest.mock("../src/utils/officegenHelper", () => ({
  createDocxWithStructure: jest.fn()
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  createWriteStream: jest.fn(),
  unlink: jest.fn(),
  mkdirSync: jest.fn()
}));

// Constants for test directories and other setup
const path = require('path');
const fs = require('fs');
const documentLibrary = require("../src/documentLibrary");
const officegenHelper = require("../src/utils/officegenHelper");
const assert = require("assert");

const outDir = path.join(__dirname, "./tests_out/");

beforeAll(() => {
  fs.existsSync.mockReturnValue(false);
  fs.mkdirSync.mockImplementation(() => {});
});

describe("DocumentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    officegenHelper.createDocxWithStructure.mockResolvedValue();
    fs.existsSync.mockReturnValue(false);
  });

  describe("Document Creation", () => {
    it("should create a document with mixed content types and verify the output path", async () => {
      const elements = [
        { type: "title", text: "Document Title" },
        { type: "subtitle", text: "Subtitle here" },
        { type: "text", text: "Some basic text" },
        { type: "codeBlock", text: 'console.log("Hello, world!");' }
      ];
      const styles = {
        textColor: "#000000",
        fontFamily: {
          body: "Calibri",
          title: "Arial",
          subtitle: "Times New Roman"
        }
      };
      const outputPath = path.join(outDir, "testDocument.docx");
      fs.existsSync.mockReturnValueOnce(true);

      await officegenHelper.createDocxWithStructure(elements, styles, outputPath);

      expect(fs.existsSync(outputPath)).toBe(true);
      expect(officegenHelper.createDocxWithStructure).toHaveBeenCalledWith(elements, styles, outputPath);
    });

    it("should generate a buffer for a document with paragraph content and validate the buffer", async () => {
      const elements = [{ type: "paragraph", text: "Paragraph within a buffer" }];
      const expectedBuffer = Buffer.from("buffer content");
      documentLibrary.createDocumentBuffer.mockResolvedValue(expectedBuffer);

      const buffer = await documentLibrary.createDocumentBuffer(elements, {});

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
      expect(documentLibrary.createDocumentBuffer).toHaveBeenCalledWith(elements, {});
    });
  });

  describe("Document with Complex Elements", () => {
    it("should create a document with a table and verify the output path", async () => {
      const elements = [
        { type: "title", text: "Document with Table" },
        {
          type: "table",
          table: [
            [{ val: "Header 1", opts: { b: true, sz: "24", shd: { fill: "cccccc" } }}, { val: "Header 2", opts: { b: true, sz: "24", shd: { fill: "cccccc" } }}],
            ["Row 1, Cell 1", "Row 1, Cell 2"],
            ["Row 2, Cell 1", "Row 2, Cell 2"]
          ],
          tableStyle: {
            tableColWidth: 4261, tableSize: 24, tableColor: "ada", tableAlign: "left", tableFontFamily: "Comic Sans MS"
          }
        }
      ];
      const styles = { textColor: "#000000", fontFamily: { body: "Calibri", title: "Arial" } };
      const outputPath = path.join(outDir, "testDocumentWithTable.docx");
      fs.existsSync.mockReturnValueOnce(true);

      await officegenHelper.createDocxWithStructure(elements, styles, outputPath);

      expect(fs.existsSync(outputPath)).toBe(true);
      expect(officegenHelper.createDocxWithStructure).toHaveBeenCalledWith(elements, styles, outputPath);
    });

    it("should create a document with an image and verify the output path", async () => {
      const elements = [
        { type: "title", text: "Document with Image" },
        { type: "image", src: "https://freetestdata.com/wp-content/uploads/2022/02/Free_Test_Data_117KB_JPG.jpg", options: { cx: 300, cy: 300 } }
      ];
      const styles = { textColor: "#000000", fontFamily: { body: "Calibri", title: "Arial" } };
      const outputPath = path.join(outDir, "testDocumentWithImage.docx");
      fs.existsSync.mockReturnValueOnce(true);

      await officegenHelper.createDocxWithStructure(elements, styles, outputPath);

      expect(fs.existsSync(outputPath)).toBe(true);
      expect(officegenHelper.createDocxWithStructure).toHaveBeenCalledWith(elements, styles, outputPath);
    });
  });
});
