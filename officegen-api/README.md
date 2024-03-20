# Officegen API

This directory contains a Node.js API for document conversion using the officegen library. Follow the steps below to set up the development environment.

## Setting Up the Development Environment

### Prerequisites

- Node.js (v12.x or higher recommended)
- npm (usually comes with Node.js)

### Installing Dependencies

After navigating to the `officegen-api` directory, install the necessary dependencies using npm:

```shell
npm install
```

This command reads the `package.json` file and installs all the dependencies listed there.

## Running the API

To start the API server, run:

```shell
npm start
```

This command will start the Node.js server, typically on port 3000, unless configured otherwise. You can access the API at `http://localhost:3000`.

## Using the API

To convert a document, send a POST request to `/convert` with the document type and content. The API currently supports converting documents to formats like DOCX, PPTX, etc.

Example request using `curl`:

```shell
curl -X POST http://localhost:3000/convert \
     -H "Content-Type: application/json" \
     -d '{"type":"docx", "content":"base64EncodedContent"}'
```

Replace `"base64EncodedContent"` with the actual Base64 encoded content of the document you wish to convert.

## Running Tests

To run the automated tests for the API, execute:

```shell
npm test
```

This command will run all tests defined in the `tests/` directory and report the results.

## Contributing

Contributions to the `officegen-api` are welcome! Please refer to the main repository's CONTRIBUTING.md file for guidelines on how to contribute.