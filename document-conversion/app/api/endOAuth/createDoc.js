export async function exportToGDoc(markdownString, title = "Document", docs) {
  let currentIndex = 1;
  let requests = [];

  const doc = await docs.documents.create({ requestBody: { title } });
  const documentId = doc.data.documentId;

  const lines = markdownString.split(/\n/);

  lines.forEach((line) => {
    let textContent = line + "\n";
    let endIndexOfContent = currentIndex + textContent.length;

    requests.push({
      insertText: {
        location: { index: currentIndex },
        text: textContent,
      },
    });

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
    } else if (line.startsWith("```")) {
      requests.push(generateCodeBlockRequest(currentIndex, endIndexOfContent));
    } else if (line.startsWith("> ")) {
      requests.push(generateBlockquoteRequest(currentIndex, endIndexOfContent));
    } else if (line.startsWith("---") || line.startsWith("***") || line.startsWith("___")) {
      requests.push(generateHorizontalRuleRequest(currentIndex, endIndexOfContent));
    }
    else {
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

function generateCodeBlockRequest(startIndex, endIndex) {
  let requests = [];

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
