const fs = require('fs');
const officegen = require('officegen');

/**
 * Creates a presentation with the given structure and saves it to the specified path.
 * @param {Array} slides - The slide definitions.
 * @param {Object} styles - Styles to be applied to the presentation.
 * @param {string} outputPath - The path to save the generated presentation.
 * @returns {Promise<void>}
 */
async function createPresentationWithStructure(slides, styles, outputPath) {
  return new Promise((resolve, reject) => {
    if (!slides || slides.length === 0) {
      reject(new Error('Slides are required.'));
      return;
    }

    const pptx = officegen('pptx');

    slides.forEach((slideData) => {
      const slide = pptx.makeTitleSlide(slideData.title, slideData.subTitle);

      if (slideData.elements && slideData.elements.length > 0) {
        slideData.elements.forEach((element) => {
          switch (element.type) {
            case 'text':
              slide.addText(element.text, element.options);
              break;
            case 'image':
              slide.addImage(element.imageUrl, element.options);
              break;
            case 'table':
              slide.addTable(element.tableData, element.options);
              break;
            case 'chart':
              slide.addChart(element.chartType, element.data, element.options);
              break;
            default:
              console.warn(`Unknown element type: ${element.type}`);
          }
        });
      }
    });

    const out = fs.createWriteStream(outputPath);
    pptx.generate(out);

    out.on('close', resolve);
    out.on('error', reject);
  });
}

/**
 * Creates a presentation buffer with the given structure.
 * @param {Array} slides - The slide definitions.
 * @param {Object} styles - Styles to be applied to the presentation.
 * @returns {Promise<Buffer>}
 */
async function createPresentationBuffer(slides, styles) {
  return new Promise((resolve, reject) => {
    const pptx = officegen('pptx');

    slides.forEach((slideData) => {
      const slide = pptx.makeTitleSlide(slideData.title, slideData.subTitle);

      if (slideData.elements && slideData.elements.length > 0) {
        slideData.elements.forEach((element) => {
          switch (element.type) {
            case 'text':
              slide.addText(element.text, element.options);
              break;
            case 'image':
              slide.addImage(element.imageUrl, element.options);
              break;
            case 'table':
              slide.addTable(element.tableData, element.options);
              break;
            case 'chart':
              slide.addChart(element.chartType, element.data, element.options);
              break;
            default:
              console.warn(`Unknown element type: ${element.type}`);
          }
        });
      }
    });

    const bufs = [];
    pptx.on('data', (chunk) => bufs.push(chunk));
    pptx.on('end', () => resolve(Buffer.concat(bufs)));
    pptx.on('error', reject);

    pptx.generate();
  });
}

module.exports = {
  createPresentationWithStructure,
  createPresentationBuffer
};
