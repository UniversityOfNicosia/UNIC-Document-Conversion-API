const fs = require('fs');
const path = require('path');
const { createPresentationWithStructure, createPresentationBuffer } = require('./presentationManager');

// Directory for test outputs
const outDir = path.join(__dirname, '../../tests_output/');

// Ensure the output directory exists before running tests
beforeAll(() => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
});

// Test suite for presentationManager functionalities
describe('Presentation Manager Tests', () => {
  // Test for creating a presentation with a title slide
  it('should create a presentation with a title slide', async () => {
    const slides = [
      { title: 'Annual Sales Report', subTitle: 'Fiscal Year 2023 Overview', elements: [] }
    ];
    const styles = {};
    const outputPath = path.join(outDir, 'testPresentationWithTitleSlide.pptx');

    await createPresentationWithStructure(slides, styles, outputPath);

    // Verify presentation creation
    expect(fs.existsSync(outputPath)).toBe(true);
  });

  // Test for generating a presentation buffer with a chart slide
  it('should generate a buffer for a presentation with a chart slide', async () => {
    const slides = [
      {
        title: 'Q1 Sales by Region',
        subTitle: '',
        elements: [
          {
            type: 'chart',
            chartType: 'bar',
            data: [
              { name: 'North America', labels: ['Jan', 'Feb', 'Mar'], values: [15000, 21000, 18000] },
              { name: 'Europe', labels: ['Jan', 'Feb', 'Mar'], values: [12000, 15000, 17000] }
            ],
            options: {}
          }
        ]
      }
    ];
    const buffer = await createPresentationBuffer(slides, {});

    // Buffer validations
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  }, 10000); // Increase timeout to 10000ms

  // Test for creating a presentation with multiple slide types
  it('should create a presentation with multiple slide types', async () => {
    const slides = [
      { title: 'Business Review 2023', subTitle: 'Detailed Analysis', elements: [] },
      {
        title: 'Annual Growth',
        subTitle: '',
        elements: [
          { 
            type: 'image', 
            imageUrl: 'https://via.placeholder.com/800.png', 
            options: {
              y: 0,
              x: 0,
              cy: '100%',
              cx: '100%'
            } 
          }
        ]
      },
      {
        title: 'Quarterly Revenue',
        subTitle: '',
        elements: [
          {
            type: 'table',
            tableData: [
              ['Q1', 'Q2', 'Q3', 'Q4'],
              ['$10K', '$15K', '$20K', '$25K']
            ],
            options: { columnWidths: [1000, 1000, 1000, 1000] }
          }
        ]
      },
      {
        title: 'Market Share',
        subTitle: '',
        elements: [
          {
            type: 'chart',
            chartType: 'pie',
            data: [
              { name: 'Product A', labels: ['Product A'], values: [30] },
              { name: 'Product B', labels: ['Product B'], values: [70] }
            ],
            options: {}
          }
        ]
      }
    ];
    const styles = {};
    const outputPath = path.join(outDir, 'testPresentationWithMultipleSlides.pptx');

    await createPresentationWithStructure(slides, styles, outputPath);

    // Verify presentation creation
    expect(fs.existsSync(outputPath)).toBe(true);
  }, 10000); // Increase timeout to 10000ms

  // Test for handling missing slide elements
  it('should throw an error for missing slide elements', async () => {
    const slides = [];
    const styles = {};
    const outputPath = path.join(outDir, 'testPresentationWithMissingElements.pptx');

    await expect(createPresentationWithStructure(slides, styles, outputPath)).rejects.toThrow('Slides are required.');
  });

  // Test for generating a presentation buffer with an image slide
  it('should generate a buffer for a presentation with an image slide', async () => {
    const slides = [
      {
        title: 'Company Logo',
        subTitle: '',
        elements: [
          {
            type: 'image',
            imageUrl: 'https://via.placeholder.com/150.png',
            options: {
              y: 0,
              x: 0,
              cy: '100%',
              cx: '100%'
            }
          }
        ]
      }
    ];
    const buffer = await createPresentationBuffer(slides, {});

    // Buffer validations
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  }, 10000); // Increase timeout to 10000ms
});

