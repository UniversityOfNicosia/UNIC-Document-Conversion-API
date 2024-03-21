const officegenHelper = require('../utils/officegenHelper');

// Service to handle document creation with structured elements
exports.createDocumentWithStructure = async (elements) => {
  try {
    const timestamp = new Date().getTime();
    const outputPath = `document_${timestamp}.docx`;
    const resultPath = await officegenHelper.createDocxWithText(text, outputPath);
    return resultPath;
  } catch (error) {
    console.error('Error creating document with text:', error);
    throw error;
  }
};
