/**
 * Wrapper to get PDF contents
 */

// Dependencies
import PDFJS from "pdfjs-dist";

/**
 * Get text of PDF from URL
 *
 * @param {*} url
 * @returns
 */
async function pdfTextFromUrl(url) {
  // Read url
  const pdf = await PDFJS.getDocument(url).promise;

  // Number of pages
  const maxPages = pdf.numPages;

  // Go through each page
  let allPageContents = "";
  for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
    const pageContents = await pdfPageText(pdf, pageNo);
    allPageContents = allPageContents + pageContents + " ";
  }

  return allPageContents;
}

/**
 * Get links from url
 *
 * @param {*} url
 * @returns
 */
async function pdfContentItemsFromUrl(url) {
  // Read url
  const pdf = await PDFJS.getDocument(url).promise;

  // Number of pages
  const maxPages = pdf.numPages;

  // Go through each page
  let allItems = [];
  for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
    const page = await pdf.getPage(pageNo);
    const pageContents = await page.getTextContent();

    allItems = allItems.concat(pageContents.items);
  }

  return allItems;
}

/**
 * Get text from a page of a PDF
 *
 * @param {*} pdf
 * @param {*} pageNo
 * @returns
 */
async function pdfPageText(pdf, pageNo) {
  const page = await pdf.getPage(pageNo);
  const pageText = generateNewLinesInPdfContent(await page.getTextContent());
  return pageText;
}

function generateNewLinesInPdfContent(pdfContent) {
  // https://stackoverflow.com/questions/44376415/display-line-breaks-as-n-in-pdf-to-text-conversion-using-pdf-js
  let p = null;
  let lastY = -1;
  let contents = "";

  pdfContent.items.forEach((token) => {
    // Tracking Y-coord and if changed create new p-tag
    if (lastY != token.transform[5]) {
      contents = `${contents}\n`;
      lastY = token.transform[5];
    }

    contents = `${contents}${token.str} `;
  });

  return contents;
}

export { pdfTextFromUrl, pdfContentItemsFromUrl };
