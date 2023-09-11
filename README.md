# Document Conversion Code Snippets 📄🔄

Welcome to the Document Conversion Code Snippets repository! This is a comprehensive collection of JavaScript/TypeScript code snippets designed to aid developers in converting documents between various formats, notably from Markdown to Google Docs and other popular formats.

## Why This Repository? 🤔

During my year working at the [@UniversityOfNicosia](https://github.com/UniversityOfNicosia), I encountered multiple document conversion challenges. Regrettably, there was a scarcity of pre-existing JavaScript solutions online. This repository emerged from the necessity to provide developers with a respite from such challenges, granting open-source access to a variety of beneficial code snippets I've assembled over time. 

Thus, this repository was born! 🎉

These functions are primarily written in TypeScript tailored for Next.JS. However, they can be easily adapted for a Node.JS environment. Whether you're looking to directly implement these snippets into your projects or use them as a foundational starting point, they're here to assist.

## Contained Code Snippets 

- `convertMarkdownToHtml`: Converts markdown to HTML using `highlight.js` and `markdown-it`.
- `exportToDocx`: Transforms markdown into the older Word document format through `convertMarkdownToHtml`.
- `exportToPptx`: Transforms markdown into a .pptx file using `pptxgenjs` and `convertMarkdownToHtml`.
- `exportToGDoc`: This function converts markdown content into Google Docs format. It preserves markdown stylings like headings, inline code, and block quotes. Note: This function operates as an integrated API. To test it, follow the setup instructions below.

### Setting Up `exportToGDoc` ⚙️

1. Clone the repository.
2. Navigate to the directory: `cd document-conversion`
3. Install dependencies: `npm i`
4. Before building, set up a `.env.local` file containing:
```
GOOGLE_OAUTH2_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_OAUTH2_CLIENT_SECRET=YOUR_CLIENT_SECRET
```
5. Run the build: `npm run build`
6. Start the development server: `npm run dev`

## Important Notice 📜

I'm excited to share these snippets with the developer community. In the spirit of open-source, if you use or adapt these snippets in your projects, please extend due credit to the original creator.

Remember, in open-source, _acknowledgment and appreciation surpass the simplicity of 'ctrl+c' and 'ctrl+v'._

## Contributing 🧑‍💻

If you come across any challenges or find an improvement, I'd appreciate it if you could contribute to this repository by submitting a pull request or opening an issue. Together, we can make this an invaluable resource for the developer community!

Happy coding! 🚀💻
