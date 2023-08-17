import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

export function convertMarkdownToHtml(markdownString: string): string {
  var md: MarkdownIt = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>';
        } catch (__) { }
      }

      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  });

  const css = `
    .hljs {
        font-family: 'Courier New', monospace;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        padding: 10px;
        overflow-x: auto;
    }
  `;

  var resultHtml: string = md.render(markdownString);

  resultHtml = `<style>${css}</style>` + resultHtml;

  return resultHtml;
}