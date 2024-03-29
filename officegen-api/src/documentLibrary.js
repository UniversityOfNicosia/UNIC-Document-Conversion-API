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
    console.log(buffer.length + ' bytes written to buffer.');
    return buffer;
  } catch (error) {
    throw error;
  }
};
