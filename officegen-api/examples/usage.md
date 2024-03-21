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
      "backgroundColor": "#FFFFFF",
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

## Downloading the Document

Currently, the API returns the path to the created document. To download the document, you can access the file directly from the server using the provided path. Future versions of the API will include direct download links or streaming capabilities.

## Error Handling

If the request fails due to missing text or other issues, the API will respond with an appropriate error message and status code.

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