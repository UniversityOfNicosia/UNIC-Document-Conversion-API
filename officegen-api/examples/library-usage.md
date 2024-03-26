# UNIC Document Conversion Library - Usage Guide

## Introduction

The UNIC Document Conversion Library is a powerful Node.js module that enables the creation of `.docx` documents from structured JSON inputs. Built on top of the `officegen` library, it offers a flexible way to generate documents with custom styles and various elements such as text, titles, subtitles, lists, bullets, and footnotes.

This guide covers the process of setting up, installing, and using this private NPM package within your projects.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v12.x or higher recommended)
- npm (usually comes with Node.js)

## Installation

As this is a private package, you'll need access to the NPM registry where the package is hosted. Make sure you're authenticated to the registry by running:

```bash
npm login --registry=https://registry.npmjs.org/
```

Then, install the package using npm:

```bash
npm install @university-of-nicosia/unic-document-conversion-library --save
```

## Setting Up Your Project

1. **Create a new Node.js project** (if you haven't already) by running `npm init` in your project directory and following the prompts.

2. **Install the UNIC Document Conversion Library** using the command provided in the Installation section above.

## Usage

To use the library, you need to import it into your Node.js application, configure your document structure and styles in JSON format, and call the library function to create a document.

### Basic Example

Here's a basic example of how to use the library:

```javascript
const documentLibrary = require('@university-of-nicosia/unic-document-conversion-library');

// Define your document structure and styles
const inputJson = {
  documentElements: [
    { type: 'title', text: 'Document Title' },
    { type: 'subtitle', text: 'Subtitle Here' },
    { type: 'paragraph', text: 'This is a simple paragraph.' },
    {
      type: 'list',
      items: ['First item', 'Second item', 'Third item']
    }
  ],
  documentStyles: {
    fontFamily: {
      title: 'Arial',
      body: 'Calibri'
    },
    textColor: '#000000'
  }
};

// Create the document
documentLibrary.createDocumentWithStructure(inputJson)
  .then((path) => console.log(`Document created at: ${path}`))
  .catch((error) => console.error('Error creating document:', error));
```

### Error Handling

The library provides error handling mechanisms. Ensure your application properly catches and handles these errors, especially for invalid inputs or issues during document generation.

## Advanced Usage

For more complex documents, refer to the `officegen` documentation to understand all supported elements and styles. The UNIC Document Conversion Library supports these features as part of the `inputJson` configuration.

## Contributing

We welcome contributions! If you have suggestions for improvements or encounter any issues, please file a report in the repository's issues section.

## License

This library is provided under the [MIT License](https://opensource.org/licenses/MIT). Please review the license terms before using or contributing to the project.