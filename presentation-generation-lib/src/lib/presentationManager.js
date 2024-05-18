const fs = require('fs');
const officegen = require('officegen');
const axios = require('axios');
const path = require('path');
const os = require('os');

/**
 * Downloads an image from a URL and saves it to a temporary file.
 * @param {string} url - The image URL.
 * @returns {Promise<string>} - The path to the downloaded image file.
 */
async function downloadImage(url) {
  const response = await axios({
    url,
    responseType: 'arraybuffer',
  });

  const imagePath = path.join(os.tmpdir(), path.basename(url));
  fs.writeFileSync(imagePath, response.data);
  return imagePath;
}

/**
 * Creates a presentation with the given structure and saves it to the specified path.
 * @param {Array} slides - The slide definitions.
 * @param {Object} styles - Styles to be applied to the presentation.
 * @param {string} outputPath - The path to save the generated presentation.
 * @returns {Promise<void>}
 */
async function createPresentationWithStructure(slides, styles, outputPath) {
  return new Promise(async (resolve, reject) => {
    if (!slides || slides.length === 0) {
      reject(new Error('Slides are required.'));
      return;
    }

    const pptx = officegen('pptx');

    for (const slideData of slides) {
      const slide = pptx.makeTitleSlide(slideData.title, slideData.subTitle);

      if (slideData.elements && slideData.elements.length > 0) {
        for (const element of slideData.elements) {
          switch (element.type) {
            case 'text':
              slide.addText(element.text, element.options);
              break;
            case 'image':
              try {
                const imagePath = await downloadImage(element.imageUrl);
                slide.addImage(imagePath, element.options);
              } catch (error) {
                reject(error);
              }
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
        }
      }
    }

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
  return new Promise(async (resolve, reject) => {
    const pptx = officegen('pptx');

    for (const slideData of slides) {
      const slide = pptx.makeTitleSlide(slideData.title, slideData.subTitle);

      if (slideData.elements && slideData.elements.length > 0) {
        for (const element of slideData.elements) {
          switch (element.type) {
            case 'text':
              slide.addText(element.text, element.options);
              break;
            case 'image':
              try {
                const imagePath = await downloadImage(element.imageUrl);
                slide.addImage(imagePath, element.options);
              } catch (error) {
                reject(error);
              }
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
        }
      }
    }

    const bufs = [];
    pptx.on('finalize', () => {
      resolve(Buffer.concat(bufs));
    });
    pptx.on('error', reject);

    pptx.generate({
      'finalize': function (written) {
        bufs.push(Buffer.from(written, 'binary'));
      },
      'error': reject
    });
  });
}

module.exports = {
  createPresentationWithStructure,
  createPresentationBuffer,
};
