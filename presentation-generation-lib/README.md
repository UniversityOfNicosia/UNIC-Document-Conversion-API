# Presentation Generation Library using Officegen

## Executive Summary
The `presentation-generation-lib` is designed to enable the automatic generation of Microsoft PowerPoint presentations. This npm package leverages the `officegen` library to facilitate the creation, customization, and distribution of presentations directly from Node.js applications, serving developers looking to integrate presentation capabilities into their systems.

## Project Scope and Objectives
- **Objective**: Develop a Node.js library that provides a programmatic interface to create and manipulate PowerPoint presentations.
- **Scope**: Includes functions for adding various types of slides, embedding different content types like text, images, and charts, and offers customization options for presentation styles.
- **Target Audience**: Software developers in need of automating presentation creation within their applications or workflows.

## Installation
To install the library, use the following command in the Node.js environment:
```bash
npm install @universityofnicosia/unic-presentation-gen-library
```

## Directory Structure
```
presentation-generation-lib/
├── src/
│   ├── lib/
│   │   └── presentationManager.js   # Core library logic
│   ├── utils/                       # Utility functions
│   └── templates/                   # Predefined presentation templates
├── examples/                        # Example scripts demonstrating usage
├── test/                            # Automated tests
├── package.json                     # Package metadata and dependencies
└── README.md                        # Installation and usage instructions
```

## Key Features
- **Slide Management**: Add slides with predefined or custom layouts.
- **Content Addition**: Embed text, images, charts, and other multimedia elements.
- **Customization**: Configure presentation settings such as size, orientation, and metadata.
- **Output Options**: Save presentations to files or stream to clients in web applications.

## Usage Example
Below is an example demonstrating how to use the library to create a presentation:

```javascript
const PresentationManager = require('@universityofnicosia/unic-presentation-gen-library');

async function generateSalesPresentation() {
  const pm = new PresentationManager();
  const pptx = pm.createPresentation({ title: 'Annual Sales Report', author: 'Jane Doe' });

  // Adding a title slide
  pm.addSlide('title', {
    title: 'Annual Sales Report',
    subTitle: 'Fiscal Year 2023 Overview'
  });

  // Adding a chart slide for Q1 sales by region
  pm.addSlide('chart', {
    title: 'Q1 Sales by Region',
    data: [
      { name: 'North America', values: [15000, 21000, 18000] },
      { name: 'Europe', values: [12000, 15000, 17000] }
    ],
    chartType: 'bar'
  });

  // Save the presentation to a file
  await pm.saveToFile('Annual_Sales_Report_2023.pptx').then(path => {
    console.log(`Presentation created at: ${path}`);
  }).catch(error => {
    console.error('Error creating presentation:', error);
  });
}

generateSalesPresentation();
```

<details>
<summary>Click to expand for advanced usage examples</summary>

---

## Adding Images, Tables, and Charts to Slides

```javascript
const PresentationManager = require('@universityofnicosia/unic-presentation-gen-library');

async function createDetailedPresentation() {
  const pm = new PresentationManager();
  const pptx = pm.createPresentation({ title: 'Comprehensive Business Review', author: 'John Doe' });

  // Adding a title slide
  pm.addSlide('title', {
    title: 'Business Review 2023',
    subTitle: 'Detailed Analysis'
  });

  // Adding an image slide
  pm.addSlide('image', {
    title: 'Annual Growth',
    imageUrl: 'https://pluspng.com/img-png/png-images--800.png',
    description: 'Visual representation of annual growth.'
  });

  // Adding a table slide
  pm.addSlide('table', {
    title: 'Quarterly Revenue',
    tableData: [
      ['Q1', 'Q2', 'Q3', 'Q4'],
      ['$10K', '$15K', '$20K', '$25K']
    ],
    options: { columnWidths: [1000, 1000, 1000, 1000] }
  });

  // Adding a chart slide
  pm.addSlide('chart', {
    title: 'Market Share',
    chartType: 'pie',
    data: [
      { name: 'Product A', values: [30], color: 'FF0000' },
      { name: 'Product B', values: [70], color: '00FF00' }
    ]
  });

  // Save the presentation to a file and log the output path
  await pm.saveToFile('Business_Review_2023.pptx').then(path => {
    console.log(`Presentation created at: ${path}`);
  }).catch(error => {
    console.error('Error creating presentation:', error);
  });
}

createDetailedPresentation();
```

## Example JSON Object Response

After generating a presentation, a typical API might return a JSON object containing details about the generated file along with a binary data buffer. Here's an example of such a response:

```json
{
  "status": "success",
  "message": "Presentation successfully generated.",
  "data": {
    "filename": "Business_Review_2023.pptx",
    "mimeType": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "size": 1024000,
    "buffer": "Base64 encoded binary data here..."
  }
}
```

This response includes the filename, MIME type, file size, and a base64 encoded buffer containing the binary data of the presentation. This can be especially useful for applications that need to stream or send the file directly over HTTP without writing it to disk.

---

</details>

## Documentation and Support
Detailed documentation will accompany the library, offering clear instructions on setting up and using its features effectively, ensuring accessibility and ease of use for all developers.

## Conclusion
The `presentation-generation-lib` extends the capabilities of the existing `document-generation-lib` to meet the specific needs of presentation management. This initiative will streamline the creation of presentations, reduce development time, and facilitate the integration of presentation capabilities into a broader range of applications and services.
