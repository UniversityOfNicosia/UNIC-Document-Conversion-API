# Document Generation API and Library for Document Conversion

The Document Generation API and Library offer a powerful way to generate `.docx` documents from structured JSON inputs. This guide provides an overview of both the API and the Node.js library usage.

## Features

- Generate `.docx` documents with custom text, titles, subtitles, lists, bullets, and footnotes.
- Easy integration into JavaScript and Node.js projects.
- Flexible document structure and styling.

## Getting Started

### API Usage

To create a document using the API, send a POST request to `/api/create-document` with your document structure and style defined in JSON.

**Example Request:**

```json
POST /api/create-document
Content-Type: application/json

{
  "elements": [
    {"type": "title", "text": "Document Title"},
    ...
  ],
  "styles": {
    "textColor": "#000000",
    "fontFamily": {
      "title": "Arial",
      ...
    }
  }
}
```

**Response:**

The API responds with the path to the created document upon success.

```json
{
  "message": "Document created successfully",
  "path": "examples/document_123456789.docx"
}
```

### Library Usage

The UNIC Document Conversion Library enables creation of documents via a Node.js module. Install the library from GitHub Packages, configure your `.npmrc` for authentication, and use the library in your projects.

**Installation:**

```bash
npm install @universityofnicosia/unic-document-conversion-library --save
```

**Example Usage:**

```javascript
const documentLibrary = require('@universityofnicosia/unic-document-conversion-library');

const inputJson = {
  "elements": [...],
  "styles": {...}
};

documentLibrary.createDocumentWithStructure(inputJson)
  .then((path) => console.log(`Document created at: ${path}`))
  .catch((error) => console.error('Error creating document:', error));
```

## Prerequisites

- Node.js (v12.x or higher)
- npm

## Documentation

For more detailed examples and error handling, please refer to the `api-usage.md` and `library-usage.md` files in the `examples` directory.

## Contributing

Contributions are welcome! If you have suggestions or encounter issues, please file a report in the issues section.

## License

This project is provided under the [MIT License](https://opensource.org/licenses/MIT).