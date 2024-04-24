# UNIC Document Gen Library - Usage Guide

## Introduction

The UNIC Document Generator Library is a powerful Node.js module that enables the creation of `.docx` documents from structured JSON inputs. Built on top of the `officegen` library, it offers a flexible way to generate documents with custom styles and various elements such as text, titles, subtitles, lists, bullets, and footnotes.

This guide details the setup, installation, and usage process of this NPM package within your projects.

## Prerequisites

Ensure the following are installed before proceeding:
- Node.js (v12.x or higher recommended)
- npm (comes bundled with Node.js)

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
   npm install @universityofnicosia/unic-document-gen-library --save
   ```

## Setting Up Your Project

1. **Initialize a new Node.js project** (if not already done) by executing `npm init` in your project directory and completing the setup prompts.

2. **Install the UNIC Document Gen Library** using the command provided in the Installation section above.

## Usage

Import the library into your Node.js application, configure your document structure and styles in JSON, and invoke the library function to create a document.

### Basic Example

Here's a simple example demonstrating the library usage:

```javascript
const documentLibrary = require('@universityofnicosia/unic-document-gen-library');

// Define your document structure and styles
const inputJson = {
  "elements": [
    { "type": "title", "text": "Document Title" },
    { "type": "subtitle", "text": "Subtitle Here" },
    { "type": "paragraph", "text": "This is a simple paragraph." },
    {
      "type": "list",
      "items": ["First item", "Second item", "Third item"]
    }
  ],
  "styles": {
    "fontFamily": {
      "title": "Arial",
      "body": "Calibri"
    },
    "textColor": "#000000"
  }
};

// Create the document
documentLibrary.createDocumentWithStructure(inputJson)
  .then((path) => console.log(`Document created at: ${path}`))
  .catch((error) => console.error('Error creating document:', error));
```

### Error Handling

It's crucial to implement error handling in your application to manage any potential issues, such as invalid inputs or problems during document generation.

## Advanced Usage

For more complex documents, refer to the `officegen` documentation to understand all supported elements and styles. The UNIC Document Generator Library supports these features as part of the `inputJson` configuration.

## Contributing

Contributions are highly appreciated! If you have improvement suggestions or encounter any issues, please submit them via the project's issue tracker.

## License

This library is distributed under the [MIT License](https://opensource.org/licenses/MIT). Ensure you review the license terms before utilizing or contributing to the project.