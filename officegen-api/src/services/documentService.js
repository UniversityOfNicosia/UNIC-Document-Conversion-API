const officegenHelper = require('../utils/officegenHelper');

// Service to handle document creation with structured elements
exports.createDocumentWithStructure = async (elements) => {
  try {
    const timestamp = new Date().getTime();
    const outputPath = `document_${timestamp}.docx`;
    const resultPath = await officegenHelper.createDocxWithStructure(elements, outputPath);
    return resultPath;
  } catch (error) {
    console.error('Error creating document with structured elements:', error);
    throw error;
  }
};
