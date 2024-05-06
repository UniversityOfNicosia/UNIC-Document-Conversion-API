const officegenHelper = require('./utils/officegenHelper');

exports.createDocumentWithStructure = async (elements, styles) => {
  try {
    if (!elements) throw new Error('Document elements are required.');

    const timestamp = new Date().getTime();
    const outputPath = `document_${timestamp}.docx`;
    const resultPath = await officegenHelper.createDocxWithStructure(elements, styles, outputPath);
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

exports.createPresentationWithStructure = async (elements, styles) => {
  return "Hello, world! Presentation created.";
};

exports.createPresentationBuffer = async (elements, styles) => {
  return "Hello, world! Presentation buffer created.";
}
