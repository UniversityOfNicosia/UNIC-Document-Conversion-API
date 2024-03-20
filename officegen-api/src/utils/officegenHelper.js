const officegen = require('officegen');

exports.generateDocument = (type, content) => {
  return new Promise((resolve, reject) => {
    let doc = officegen(type);
    doc.on('finalize', (writtenBytes) => {
      resolve(`Document created successfully: ${writtenBytes} bytes written.`);
    });
    doc.on('error', (err) => {
      reject(err);
    });

    // Add content to the document based on its type
    // For example, if type is 'docx', add paragraphs; if 'pptx', add slides

    // Finalize the document to trigger 'finalize' event
    doc.generate();
  });
};
