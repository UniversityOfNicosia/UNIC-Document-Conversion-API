import { link } from "fs";

export async function exportToGDoc(markdownString, title = "Document", docs) {
  let currentIndex = 1;
  let requests = [];

  const doc = await docs.documents.create({ requestBody: { title } });
  const documentId = doc.data.documentId;

  let inCodeBlock = false;
  let codeBlockContent = "";

  const lines = markdownString.split(/\n/);
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;

  lines.forEach((line) => {
    let textContent, endIndexOfContent;

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        inCodeBlock = false;
        textContent = codeBlockContent + "\n";
        endIndexOfContent = currentIndex + textContent.length;

        requests.push(generateCodeBlockRequest(currentIndex, endIndexOfContent, textContent));
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
    } else {
      textContent = line + "\n";
    }

    textContent = line.replace(linkRegex, (match, linkText, linkUrl) => linkText) + "\n";
    endIndexOfContent = currentIndex + textContent.length;

    requests.push({
      insertText: {
        location: { index: currentIndex },
        text: textContent,
      },
    });

    let match;
    let offset = 0;
    while ((match = linkRegex.exec(line)) !== null) {
      const [fullMatch, linkText, linkUrl] = match;
      const linkStart = currentIndex + line.indexOf(linkText, offset) - 1;
      const linkEnd = linkStart + linkText.length;

      requests.push(generateHyperlinkRequest(linkStart, linkEnd, linkUrl));
      offset = linkEnd;
    }

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

    currentIndex = endIndexOfContent;
  });

  await docs.documents.batchUpdate({
    documentId,
    requestBody: { requests },
  });

  return documentId;
}

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

function generateHorizontalRuleRequest(startIndex, endIndex) {
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
