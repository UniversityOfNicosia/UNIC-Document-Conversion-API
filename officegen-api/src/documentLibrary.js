const officegenHelper = require('./utils/officegenHelper');

exports.createDocumentWithStructure = async (inputJson) => {
  try {
    const { documentElements, documentStyles } = inputJson;
    if (!documentElements) throw new Error('Document elements are required.');

    const timestamp = new Date().getTime();
    const outputPath = `document_${timestamp}.docx`;
    const resultPath = await officegenHelper.createDocxWithStructure(documentElements, documentStyles, outputPath);
    return resultPath;
  } catch (error) {
    throw error;
  }
};

exports.createDocumentBuffer = async (elements, styles) => {
  try {
    const buffer = await officegenHelper.createDocxBuffer(elements, styles);
    return buffer;
  } catch (error) {
    throw error;
  }
};
