# Officegen API

This directory contains a Node.js API for document conversion using the officegen library. The API now supports creating `.docx` documents with custom text input. Follow the steps below to set up the development environment and learn how to use the new features.

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

### Creating a Document with Custom Text

To create a `.docx` document containing custom text, send a POST request to `/api/create-document` with the text in the request body.

Example request using `curl`:

```shell
curl -X POST http://localhost:3000/api/create-document \
     -H "Content-Type: application/json" \
     -d '{"text":"Hello, world!"}'
```

The API will create a `.docx` document containing the provided text and return the path to the created document.

## Running Tests

To run the automated tests for the API, execute:

```shell
npm test
```

This command will run all tests defined in the `tests/` directory and report the results.

## Contributing

Contributions to the `officegen-api` are welcome! Please refer to the main repository's CONTRIBUTING.md file for guidelines on how to contribute.
