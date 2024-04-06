# Officegen API

This directory contains a Node.js API for document conversion using the `officegen` library. The API supports creating `.docx` documents with structured elements and custom styles. With the introduction of the API as an NPM package, integration into JavaScript and Node.js projects is streamlined, promoting ease of use and broad applicability.

## Features

- Create `.docx` documents with a variety of elements (text, titles, subtitles, lists, bullets, footnotes).
- Apply custom styles to document elements (font family, size, color).
- Package available as an NPM module for easy inclusion in projects.

## Setting Up the Development Environment

### Prerequisites

- Node.js (v12.x or higher recommended)
- npm (usually comes with Node.js)

### Installing Dependencies

After navigating to the `officegen-api` directory, install the necessary dependencies using npm:

```shell
npm install
```

## Running the API

To start the API server, run:

```shell
npm start
```

Access the API at `http://localhost:3000/api`.

## Using the API

### Creating a Document

Send a POST request to `/api/create-document` with `documentElements` and `documentStyles` in the JSON body.

Example request using `curl`:

```shell
curl -X POST http://localhost:3000/api/create-document \
     -H "Content-Type: application/json" \
     -d '{"documentElements": [{"type": "title", "text": "Hello World"}], "documentStyles": {"fontFamily": {"title": "Arial"}}}'
```

## Contributing

Contributions are welcome! Please refer to the main repository's CONTRIBUTING.md file for guidelines.