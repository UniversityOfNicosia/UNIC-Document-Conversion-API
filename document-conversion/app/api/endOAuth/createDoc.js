/**
 * This module exports a function that converts a markdown string to a Google Doc.
 * It uses the Google Docs API to create a new document and insert the markdown content.
 * The markdown is converted to plain text and formatted using the Google Docs API.
 * Images and links are also supported.
 *
 * @module createDoc
 */

/**
 * Converts a markdown string to a Google Doc.
 *
 * @param {string} markdownString - The markdown string to convert.
 * @param {string} [title="Document"] - The title of the Google Doc.
 * @param {object} docs - The Google Docs API client.
 * @returns {string} The ID of the created Google Doc.
 */
export async function exportToGDoc(markdownString, title = "Document", docs) {
  let currentIndex = 1;
  let requests = [];

  const doc = await docs.documents.create({ requestBody: { title } });
  const documentId = doc.data.documentId;

  let inCodeBlock = false;
  let codeBlockContent = "";

  const lines = markdownString.split(/\n/);
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;
  const italicRegex = /_(.*?)_|\*(.*?)\*/g;
  const codeRegex = /`(.*?)`/g;

  lines.forEach((line) => {
    let textContent, endIndexOfContent;

    // Handle ```code blocks```
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        inCodeBlock = false;
        textContent = codeBlockContent + "\n";
        endIndexOfContent = currentIndex + textContent.length;
    
        const codeBlockRequests = generateCodeBlockRequest(currentIndex, endIndexOfContent, textContent);
        requests.splice(currentIndex, 0, ...codeBlockRequests);
    
        currentIndex = endIndexOfContent;
        codeBlockContent = "";
      } else {
        inCodeBlock = true;
      }
      return;
    }
    

    if (inCodeBlock) {
      codeBlockContent += line + "\n";
      return;
    }

    if (line.startsWith("#")) {
      textContent = line.replace(/^#+\s*/, "") + "\n";
    } else if (line.startsWith("---") || line.startsWith("***") || line.startsWith("___")) {
      textContent = "\n";
    } else if (line.startsWith("> ")) {
      textContent = line.replace(/^>\s*/, "") + "\n";
    } else if (imageRegex.test(line)) {
      const imageUrl = line.match(imageRegex)[0].replace(/!\[.*?\]\(/, "").replace(/\)/, "");
      requests.push(generateImageRequest(currentIndex, imageUrl));
      currentIndex += 1;
      return;
    } else {
      textContent = line + "\n";
    }

    // Remove markdown formatting
    textContent = textContent.replace(linkRegex, (match, linkText, linkUrl) => linkText);
    textContent = textContent.replace(boldRegex, (match, bold1, bold2) => bold1 || bold2);
    textContent = textContent.replace(italicRegex, (match, italic1, italic2) => italic1 || italic2);
    textContent = textContent.replace(codeRegex, (match, code) => code);

    endIndexOfContent = currentIndex + textContent.length;

    requests.push({
      insertText: {
        location: { index: currentIndex },
        text: textContent,
      },
    });

    // Handle headings
    if (line.startsWith("# ")) {
      requests.push(generateHeadingRequest("HEADING_1", currentIndex, endIndexOfContent));
    } else if (line.startsWith("## ")) {
      requests.push(generateHeadingRequest("HEADING_2", currentIndex, endIndexOfContent));
    } else if (line.startsWith("### ")) {
      requests.push(generateHeadingRequest("HEADING_3", currentIndex, endIndexOfContent));
    } else if (line.startsWith("#### ")) {
      requests.push(generateHeadingRequest("HEADING_4", currentIndex, endIndexOfContent));
    } else if (line.startsWith("##### ")) {
      requests.push(generateHeadingRequest("HEADING_5", currentIndex, endIndexOfContent));
    } else if (line.startsWith("###### ")) {
      requests.push(generateHeadingRequest("HEADING_6", currentIndex, endIndexOfContent));
    } else if (line.startsWith("> ")) {
      requests.push(generateBlockquoteRequest(currentIndex, endIndexOfContent));
    } else if (line.startsWith("---") || line.startsWith("***") || line.startsWith("___")) {
      requests.push(generateHorizontalRuleRequest(currentIndex));
    } else {
      requests.push(generateNormalTextRequest(currentIndex, endIndexOfContent));
    }

    requests.push(...processInlineFormatting(line, currentIndex));

    currentIndex = endIndexOfContent;
  });

  await docs.documents.batchUpdate({
    documentId,
    requestBody: { requests },
  });


  return documentId;
}

/**
 * Processes inline formatting in a markdown string.
 * Returns an array of requests to be sent to the Google Docs API.
 * 
 * @param {string} line - The line to process.
 * @param {number} currentIndex - The current index in the document.
 * @returns {object[]} An array of requests to be sent to the Google Docs API.
 */
function processInlineFormatting(line, currentIndex) {
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;
  const italicRegex = /_(.*?)_|\*(.*?)\*/g;
  const codeRegex = /`(.*?)`/g;

  const requests = [];

  // Handling links
  let linkOffset = 0;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(line)) !== null) {
    const [fullMatch, linkText, linkUrl] = linkMatch;
    const linkStart = currentIndex + line.indexOf(linkText, linkOffset) - 1; // -1 for the [
    const linkEnd = linkStart + linkText.length;

    requests.push(generateHyperlinkRequest(linkStart, linkEnd, linkUrl));
    linkOffset = linkEnd;
  }

  // Handling bold text
  let boldOffset = 0;
  let boldMatch;
  while ((boldMatch = boldRegex.exec(line)) !== null) {
    const boldText = boldMatch[1] || boldMatch[2];
    if (!boldText) continue;
    const boldStart = currentIndex + line.indexOf(boldText, boldOffset) - 2; // -2 for ** or __
    const boldEnd = boldStart + boldText.length;

    requests.push(generateBoldRequest(boldStart, boldEnd));
    boldOffset = boldEnd;
  }

  // Handling italic text
  let italicOffset = 0;
  let italicMatch;
  while ((italicMatch = italicRegex.exec(line)) !== null) {
    const italicText = italicMatch[1] || italicMatch[2];
    if (!italicText) continue;
    const italicStart = currentIndex + line.indexOf(italicText, italicOffset) - 1; // -1 for _ or *
    const italicEnd = italicStart + italicText.length;

    requests.push(generateItalicRequest(italicStart, italicEnd));
    italicOffset = italicEnd;
  }

  // Handling code
  let codeOffset = 0;
  let codeMatch;
  while ((codeMatch = codeRegex.exec(line)) !== null) {
    const codeText = codeMatch[1];
    if (!codeText) continue;
    const codeStart = currentIndex + line.indexOf(codeText, codeOffset) - 1; // -1 for `
    const codeEnd = codeStart + codeText.length;

    requests.push(generateCodeRequest(codeStart, codeEnd));
    codeOffset = codeEnd;
  }

  return requests;
}

/**
 * Generates a request to set the heading type of a paragraph.
 * 
 * @param {string} headingType - The heading type.
 * @param {number} startIndex - The start index of the paragraph.
 * @param {number} endIndex - The end index of the paragraph.
 * @returns {object} A request to be sent to the Google Docs API.
 */
function generateHeadingRequest(headingType, startIndex, endIndex) {
  return {
    updateParagraphStyle: {
      range: {
        startIndex,
        endIndex,
      },
      paragraphStyle: {
        namedStyleType: headingType,
      },
      fields: "namedStyleType",
    },
  };
}

/**
 * Generates requests to insert a code block.
 * 
 * @param {number} startIndex - The start index of the code block.
 * @param {number} endIndex - The end index of the code block.
 * @param {string} textContent - The text content of the code block.
 * @returns {object[]} An array of requests to be sent to the Google Docs API.
 */
function generateCodeBlockRequest(startIndex, endIndex, textContent) {
  let requests = [];

  requests.push({
    insertText: {
      location: { index: startIndex },
      text: textContent,
    },
  });

  requests.push({
    updateParagraphStyle: {
      range: {
        startIndex,
        endIndex,
      },
      paragraphStyle: {
        namedStyleType: "NORMAL_TEXT",
      },
      fields: "namedStyleType",
    },
  });

  // Monospace font
  requests.push({
    updateTextStyle: {
      range: {
        startIndex,
        endIndex,
      },
      textStyle: {
        weightedFontFamily: {
          fontFamily: "Courier New",
          weight: 400,
        },
      },
      fields: "weightedFontFamily",
    },
  });

  // Block quote
  requests.push({
    updateParagraphStyle: {
      range: {
        startIndex,
        endIndex,
      },
      paragraphStyle: {
        indentStart: {
          magnitude: 36,
          unit: "PT",
        },
      },
      fields: "indentStart",
    },
  });

  return requests;
}

/**
 * Generates a request to insert a block quote.
 * 
 * @param {number} startIndex - The start index of the block quote.
 * @param {number} endIndex - The end index of the block quote.
 * @returns {object} A request to be sent to the Google Docs API.
 */ 
function generateBlockquoteRequest(startIndex, endIndex) {
  return {
    updateParagraphStyle: {
      range: {
        startIndex,
        endIndex,
      },
      paragraphStyle: {
        indentStart: {
          magnitude: 36,
          unit: "PT",
        },
      },
      fields: "indentStart",
    },
  };
}

/**
 * Generates a request to insert a horizontal rule.
 * 
 * @param {number} startIndex - The start index of the horizontal rule.
 * @returns {object} A request to be sent to the Google Docs API.
 */
function generateHorizontalRuleRequest(startIndex) {
  return {
    insertInlineImage: {
      location: {
        index: startIndex,
      },
      uri: "https://freepngimg.com/thumb/web_design/24676-7-horizontal-line-transparent-background.png",
      objectSize: {
        width: {
          magnitude: 500,
          unit: "PT",
        },
      },
    },
  };
}

/**
 * Generates a request to set the paragraph style to normal text.
 * 
 * @param {number} startIndex - The start index of the paragraph.
 * @param {number} endIndex - The end index of the paragraph.
 * @returns {object} A request to be sent to the Google Docs API.
 */
function generateNormalTextRequest(startIndex, endIndex) {
  return {
    updateParagraphStyle: {
      range: {
        startIndex,
        endIndex,
      },
      paragraphStyle: {
        namedStyleType: "NORMAL_TEXT",
      },
      fields: "namedStyleType",
    },
  };
}

/**
 * Generates a request to insert a hyperlink.
 * 
 * @param {number} startIndex - The start index of the hyperlink.
 * @param {number} endIndex - The end index of the hyperlink.
 * @param {string} url - The URL of the hyperlink.
 * @returns {object} A request to be sent to the Google Docs API.
 */
function generateHyperlinkRequest(startIndex, endIndex, url) {
  return {
    updateTextStyle: {
      range: {
        startIndex,
        endIndex,
      },
      textStyle: {
        link: {
          url,
        },
      },
      fields: "link",
    },
  };
}

/**
 * Generates a request to insert an image.
 * 
 * @param {number} startIndex - The start index of the image.
 * @param {string} imageUrl - The URL of the image.
 * @returns {object} A request to be sent to the Google Docs API.
 */
function generateImageRequest(startIndex, imageUrl) {
  return {
    insertInlineImage: {
      location: {
        index: startIndex,
      },
      uri: imageUrl,
      objectSize: {
        width: {
          magnitude: 500,
          unit: "PT",
        },
      },
    },
  };
}

/**
 * Generates a request to set the bold property of a text range.
 * 
 * @param {number} startIndex - The start index of the text range.
 * @param {number} endIndex - The end index of the text range.
 * @returns {object} A request to be sent to the Google Docs API.
 */
function generateBoldRequest(startIndex, endIndex) {
  return {
    updateTextStyle: {
      range: {
        startIndex,
        endIndex,
      },
      textStyle: {
        bold: true,
      },
      fields: "bold",
    },
  };
}

/** 
 * Generates a request to set the italic property of a text range.
 * 
 * @param {number} startIndex - The start index of the text range.
 * @param {number} endIndex - The end index of the text range.
 * @returns {object} A request to be sent to the Google Docs API.
 */
function generateItalicRequest(startIndex, endIndex) {
  return {
    updateTextStyle: {
      range: {
        startIndex,
        endIndex,
      },
      textStyle: {
        italic: true,
      },
      fields: "italic",
    },
  };
}

/**
 * Generates a request to set the code property of a text range.
 * 
 * @param {number} startIndex - The start index of the text range.
 * @param {number} endIndex - The end index of the text range.
 * @returns {object} A request to be sent to the Google Docs API.
 */
function generateCodeRequest(startIndex, endIndex) {
  return {
    updateTextStyle: {
      range: {
        startIndex,
        endIndex,
      },
      textStyle: {
        weightedFontFamily: {
          fontFamily: "Courier New",
          weight: 400,
        },
      },
      fields: "weightedFontFamily",
    },
  };
}