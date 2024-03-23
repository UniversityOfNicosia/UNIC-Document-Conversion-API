const axios = require('axios');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { createDocxWithStructure } = require('../utils/officegenHelper');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const BASE_URL = process.env.BASE_URL;

// Export document to MyFiles
async function exportToMyFiles(documentElements, documentStyles, jwtToken, apiKey, appId) {
  try {
    // Step 1: Generate S3 path
    const generatePathResponse = await axios.post(`${BASE_URL}/system/storage/generate-path`, {
      AdditionalPaths: ['officegen-api', 'exports'],
      IsInternal: false
    }, {
      headers: {
        'X-Api-Key': apiKey,
        'X-App-Id': appId,
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const { S3Bucket, S3FilePrefixKey, ProfileID, CallbackUrl } = generatePathResponse.data;

    // Step 2: Generate document
    const documentPath = await createDocxWithStructure(documentElements, documentStyles, 'temp.docx');

    // Step 3: Upload to S3
    const fileContent = fs.readFileSync(path.join(__dirname, '..', '..', 'examples', documentPath));
    await s3.upload({
      Bucket: S3Bucket,
      Key: `${S3FilePrefixKey}/${path.basename(documentPath)}`,
      Body: fileContent
    }).promise();

    // Step 4: Notify Accelerate backend
    await axios.post(CallbackUrl, {
      ProfileID,
      FileMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      FileName: path.basename(documentPath),
      FilePath: `${S3FilePrefixKey}/${path.basename(documentPath)}`,
      AppID: appId,
      FileSize: fileContent.length
    }, {
      headers: {
        'X-Api-Key': apiKey,
        'X-App-Id': appId
      }
    });

    return `File successfully uploaded and registered: ${S3FilePrefixKey}/${path.basename(documentPath)}`;
  } catch (error) {
    console.error('Failed to export document to MyFiles:', error);
    throw error;
  }
}

// Service to handle document creation with structured elements
exports.createDocumentWithStructure = async (elements, styles) => {
  try {
    const timestamp = new Date().getTime();
    const outputPath = `document_${timestamp}.docx`;
    const resultPath = await officegenHelper.createDocxWithStructure(elements, styles, outputPath);
    return resultPath;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};
