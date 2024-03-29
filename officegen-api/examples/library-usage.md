# UNIC Document Conversion Library - Usage Guide

## Introduction

The UNIC Document Conversion Library is a powerful Node.js module that enables the creation of `.docx` documents from structured JSON inputs. Built on top of the `officegen` library, it offers a flexible way to generate documents with custom styles and various elements such as text, titles, subtitles, lists, bullets, and footnotes.

This guide covers the process of setting up, installing, and using this private NPM package within your projects.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v12.x or higher recommended)
- npm (usually comes with Node.js)

## Installation

Since this package is hosted on the GitHub Packages registry associated with the UniversityOfNicosia organization, you'll need to authenticate to GitHub Packages to install the library. Configure your project to use GitHub Packages:

1. Create or edit the `.npmrc` file in your project's root directory to include the following line:
   ```
   @universityofnicosia:registry=https://npm.pkg.github.com
   ```
2. Authenticate to GitHub Packages. You can use a personal access token (PAT) with read:packages permission. Configure the token in your global `~/.npmrc` file (not the project's `.npmrc` to avoid committing sensitive information):
   ```
   //npm.pkg.github.com/:_authToken=YOUR_PERSONAL_ACCESS_TOKEN
   ```
3. Install the package using npm:
   ```bash
   npm install @universityofnicosia/unic-document-conversion-library --save
   ```

## Setting Up Your Project

1. **Create a new Node.js project** (if you haven't already) by running `npm init` in your project directory and following the prompts.

2. **Install the UNIC Document Conversion Library** using the command provided in the Installation section above.

## Usage

To use the library, you need to import it into your Node.js application, configure your document structure and styles in JSON format, and call the library function to create a document.

### Basic Example

Here's a basic example of how to use the library:

```javascript
const documentLibrary = require('@universityofnicosia/unic-document-conversion-library');

// Define your document structure and styles
const inputJson = {
  elements: [
    { type: 'title', text: 'Document Title' },
    { type: 'subtitle', text: 'Subtitle Here' },
    { type: 'paragraph', text: 'This is a simple paragraph.' },
    {
      type: 'list',
      items: ['First item', 'Second item', 'Third item']
    }
  ],
  styles: {
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