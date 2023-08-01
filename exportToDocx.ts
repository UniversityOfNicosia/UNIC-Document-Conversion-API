import { convertMarkdownToHtml } from './markdownToHtml';

declare global {
  interface Navigator {
    msSaveOrOpenBlob?: (blob: any, defaultName?: string) => boolean
  }
}

export function exportToDocx(markdownString: string, fileName: string = 'document.doc'): void {
  const preHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"> <head><meta charset="utf-8"><title>Shared Powerflow Message</title><style>body { font-family: Calibri, sans-serif; font-size: 11pt; }</style></head><body>';
  const postHtml = "</body></html>";
  const htmlString: string = convertMarkdownToHtml(markdownString);

  const html = preHtml + htmlString + postHtml;

  var link = document.createElement("a");

  document.body.appendChild(link);

  link.href = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
  link.download = fileName;
  link.click();

  document.body.removeChild(link);
}