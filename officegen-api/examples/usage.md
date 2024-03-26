# Officegen API Usage Examples

This document provides examples of how to use the Officegen API to create `.docx` documents with custom text. Future updates will include more complex document structures and styles.

## Creating a Document with Text

To create a document containing simple text, send a POST request to the `/api/create-document` endpoint with a JSON payload containing the text.

### Request

`POST /api/create-document`

Content-Type: application/json

```json
{
  "documentElements": [
    {
      "type": "title",
      "text": "Document Title"
    },
    {
      "type": "subtitle",
      "text": "Document Subtitle"
    },
    {
      "type": "paragraph",
      "text": "This is a simple paragraph."
    },
    {
      "type": "bullet",
      "items": [
        "Item 1",
        "Item 2",
        "Item 3"
      ]
    },
    {
      "type": "list",
      "items": [
        "Item 1",
        "Item 2",
        "Item 3"
      ]
    },
    {
      "type": "footnotes",
      "text": "This is document footnotes"
    }
  ],
    "documentStyles": 
    {
      "textColor": "#000000",
      "fontFamily": 
      {
        "title": "Arial",
        "subtitle": "Times New Roman",
        "body": "Calibri"
      }
    }
}
```

### Response

Upon successful document creation, the API will respond with a 201 status code and a JSON object containing the message and the path to the created document.

```json
{
  "message": "Document created successfully",
  "path": "examples/document_123456789.docx"
}
```

### Downloading the Document

Currently, the API returns the path to the created document. To download the document, you can access the file directly from the server using the provided path. Future versions of the API will include direct download links or streaming capabilities.

## Exporting Document to MyFiles

To export a generated document to MyFiles, ensuring it's saved on S3 and registered with the Accelerate backend, use the `/api/export-to-myfiles` endpoint. This requires additional information such as the JWT token, API key, and App ID.

### Request

`POST /api/export-to-myfiles`

Content-Type: application/json

```json
{
  "documentElements": [
    {
      "type": "text",
      "text": "Export this document to MyFiles."
    }
  ],
  "documentStyles": {
    "textColor": "#000000",
    "fontFamily": {
      "body": "Calibri"
    }
  },
  "jwtToken": "YOUR_JWT_TOKEN",
  "apiKey": "API_KEY_OF_EXTERNAL_SERVICE",
  "appId": "APP_ID"
}
```

### Response

The API will upload the document to S3 and register it with the Accelerate backend. Upon success, it will respond with a message indicating the document has been successfully uploaded and registered.

```json
{
  "message": "File successfully uploaded and registered: private/powerflow/138950/1/1/christostest/test.docx"
}
```

## Error Handling

Both endpoints provide detailed error messages in case of failure. Ensure that your requests include all required fields and that your JWT token, API key, and App ID are valid.

### Example Error Response

```json
{
  "message": "Text is required"
}
```

Status code: 400

## Future Enhancements

Future versions of the API will support:

- Complex document structures (titles, subtitles, lists, bullets, footnotes, etc.)
- Styling options (background color, text color, font, etc.)
- Direct document download links or streaming

Stay tuned for updates and additional features!