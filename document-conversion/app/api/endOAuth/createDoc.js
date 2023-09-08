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

    textContent = textContent.replace(linkRegex, (match, linkText, linkUrl) => linkText);
    textContent = textContent.replace(boldRegex, (match, boldText) => boldText); // This is line 65
    endIndexOfContent = currentIndex + textContent.length;

    requests.push({
      insertText: {
        location: { index: currentIndex },
        text: textContent,
      },
    });
    console.log("insertText request added. Start:", currentIndex, "End:", endIndexOfContent);

    // Handle [link](url)
    let linkMatch;
    let linkOffset = 0;
    while ((linkMatch  = linkRegex.exec(line)) !== null) {
      const [fullMatch, linkText, linkUrl] = linkMatch;
      const linkStart = currentIndex + line.indexOf(linkText, linkOffset) - 1;
      const linkEnd = linkStart + linkText.length;

      requests.push(generateHyperlinkRequest(linkStart, linkEnd, linkUrl));
      console.log("hyperlink request added. Start:", linkStart, "End:", linkEnd);
      linkOffset = linkEnd;
    }

//     // Handle **strong**
//     let boldMatch;
//     let boldOffset = 0;
//     while ((boldMatch = boldRegex.exec(line)) !== null) {
//       const boldText = boldMatch[1] || boldMatch[2];
//       if (!boldText) continue;
//       const boldStart = currentIndex + line.indexOf(boldText, boldOffset);
//       const boldEnd = boldStart + boldText.length;

//       requests.push(generateBoldRequest(boldStart, boldEnd));
//       console.log("bold request added. Start:", boldStart, "End:", boldEnd);
//       boldOffset = boldEnd;
// }

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

    currentIndex = endIndexOfContent;
  });

  await docs.documents.batchUpdate({
    documentId,
    requestBody: { requests },
  });


  console.log("Last index:", currentIndex);
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
  console.log("Generating hyperlink. Start:", startIndex, "End:", endIndex, "URL:", url);
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