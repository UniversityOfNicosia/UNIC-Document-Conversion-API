import PptxGenJS from 'pptxgenjs';
import { convertMarkdownToHtml } from './markdownToHtml';

// Constants
const MAX_CHARS_PER_LINE = 90;
const LINE_SPACING = 0.35;
const MAX_Y = 6.5;

// This function will check if the content fits in the current slide, and if not, it will create a new slide
function contentLimiter(y: number, slide: any, pptx: any, lines: number = 0) {
    if (y + lines * LINE_SPACING > MAX_Y) {
        slide = pptx.addSlide();
        y = 0.5;
    }
    return { y, slide };
}

/**
 * This function converts a markdown string to a PowerPoint presentation (.pptx file),
 * leveraging the `markdownToHtml` function for the markdown to HTML conversion,
 * and the `pptxgenjs` library for the PowerPoint presentation creation.
 * 
 * @param {string} markdownString - The markdown string to convert to .pptx file.
 * @param {string} fileName - The name of the output .pptx file (default value is 'presentation.pptx').
 * 
 * @returns {void} - The .pptx file that was created from the markdown string.
 */
export function exportToPptx(markdownString: string, fileName = 'presentation.pptx') {
    const htmlString = convertMarkdownToHtml(markdownString);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, 'text/html');

    const pptx = new PptxGenJS();

    const bodyElements = Array.from(htmlDoc.body.children);
    let slide = pptx.addSlide();
    let y = 0.5;

    bodyElements.forEach((element, i) => {
        let lines = 0;
        
        // Calculate the number of lines that this element will take
        if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'P' || element.tagName === 'BLOCKQUOTE' || element.tagName === 'A') {
            lines = Math.ceil((element.textContent || '').length / MAX_CHARS_PER_LINE) + 1;
        } else if (element.tagName === 'UL' || element.tagName === 'OL') {
            lines = Array.from(element.querySelectorAll('li')).reduce((totalLines, item) => totalLines + Math.ceil((item.textContent || '').length / MAX_CHARS_PER_LINE), 0) + 1;
        } else if (element.tagName === 'TABLE') {
            lines = Array.from((element as HTMLTableElement).rows).length * 0.5 + 1;
        } else if (element.tagName === 'IMG') {
            lines = 3.5;
        } else if (element.tagName === 'CODE' || element.tagName === 'PRE') {
            lines = (element.textContent || '').split('\n').length * 0.5 + 1;
        } 

        ({ y, slide } = contentLimiter(y, slide, pptx, lines));

        // Add the element to the slide
        if (element.tagName === 'H1' || element.tagName === 'H2') {
            if (i !== 0) {
                slide = pptx.addSlide();
                y = 0.5;
            }
            slide.addText(element.textContent || '', {
                x: 0.5,
                y: y,
                fontSize: (element.tagName === 'H1') ? 24 : 18,
                bold: true,
                italic: element.tagName === 'H2',
            });
            y += 0.4;
        } else if (element.tagName === 'P') {
            const strongElement = element.querySelector('strong');
            let textContent = strongElement ? (strongElement.textContent || '') : (element.textContent || '');
            const lines = Math.ceil(textContent.length  / MAX_CHARS_PER_LINE);
            const increment = 0.15 * lines;
            y += increment;
            if (strongElement) {
                slide.addText(textContent, { x: 0.5, y: y, fontSize: 14, bold: true });
            } else {
                slide.addText(textContent, { x: 0.5, y: y, fontSize: 14 });
            }
            y += increment;
        } else if (element.tagName === 'UL' || element.tagName === 'OL') {
            const listItems = Array.from(element.querySelectorAll('li'));
            listItems.forEach((item) => {
                const lines = Math.ceil((item.textContent || '').length / MAX_CHARS_PER_LINE);
                const increment = 0.2 * lines;
                y += increment;
                slide.addText(item.textContent || '', { x: 0.8, y: y, fontSize: 14 });
            y += 0.35;
            });
        } else if (element.tagName === 'IMG') {
            const img = element as HTMLImageElement;
            const imgData = img.src.split(',')[1];
            const imgExt = img.src.split(';')[0].split('/')[1];
            slide.addImage({ data: imgData, x: 0.5, y: y, w: 5, h: 3 });
            y += 3.5;
        } else if (element.tagName === 'CODE' || element.tagName === 'PRE') {
            const codeElement = element as HTMLElement;
            let codeBlock = codeElement.textContent;
            let lines = (codeBlock || '').split('\n').length - 1;
            const increment = LINE_SPACING * lines / 3;
            y += increment + 0.2;
            slide.addText(codeElement.textContent || '', { x: 0.5, y: y, fontSize: 14, fontFace: 'Courier New' });
            y += increment + 0.2;
        } else if (element.tagName === 'TABLE') {
            const tableElement = element as HTMLTableElement;
            const rows = Array.from(tableElement.rows);
            const cols = Array.from(rows[0].cells);
        
            const baseRowHeight = 0.5;
            const totalTableWidth = 6.0;
        
            const colWidth = totalTableWidth / cols.length;
            const totalHeight = baseRowHeight * rows.length;
        
            const colWidths = cols.map(() => colWidth);
            const tableData: any = rows.map((row) => {
                const rowData = Array.from(row.cells).map((cell) => {
                    return {
                        text: cell.textContent || '',
                        options: {
                            fontSize: 14,
                            valign: 'middle',
                            align: 'center',
                        },
                    };
                });
                return rowData;
            });
            slide.addTable(tableData, { x: 0.5, y: y, w: totalTableWidth, h: totalHeight, colW: colWidths });
            y += totalHeight;
        } else if (element.tagName === 'HR') {
            slide = pptx.addSlide();
            y = 0.5;
        } else if (element.tagName === 'BLOCKQUOTE') {
            const blockquoteElement = element as HTMLElement;
            const lines = Math.ceil((blockquoteElement.textContent || '').length / MAX_CHARS_PER_LINE);
            const increment = LINE_SPACING * lines;
            y += increment;
            slide.addText(blockquoteElement.textContent || '', { x: 0.5, y: y, fontSize: 14, italic: true });
            y += increment;
        } else if (element.tagName === 'A') {
            const aElement = element as HTMLAnchorElement;
            const lines = Math.ceil((aElement.textContent || '').length / MAX_CHARS_PER_LINE);
            const increment = LINE_SPACING * lines;
            y += increment;
            slide.addText(aElement.textContent || '', { x: 0.5, y: y, fontSize: 14, hyperlink: { url: aElement.href } });
            y += increment;
        } else {
            console.log('Unknown element', element);
        }
    });

    pptx.writeFile({ fileName: fileName })
        .then(() => {
            console.log('Presentation created successfully');
        })
        .catch((error: any) => {
            console.error('Error creating presentation:', error);
        });
}