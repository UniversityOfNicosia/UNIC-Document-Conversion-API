const officegenHelper = require('../utils/officegenHelper');

// Service to handle document creation with text input
exports.createDocumentWithText = async (text) => {
  try {
    // Define the output file name based on current timestamp to avoid overwriting
    const timestamp = new Date().getTime();
    const outputPath = `document_${timestamp}.docx`;

    // Use the officegenHelper to create the document
    const resultPath = await officegenHelper.createDocxWithText(text, outputPath);

    // Return the path of the created document
    return resultPath;
  } catch (error) {
    console.error('Error creating document with text:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};
