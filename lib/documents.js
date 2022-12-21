// Dependencies
import { join, basename } from "path";
import fetch from "node-fetch";
import { parse } from "node-html-parser";
import { writeDataSync, existsSync } from "indian-ocean";
import Downloader from "nodejs-file-downloader";
import captureWebsite from "capture-website";

/**
 * Get documents in a structured way.
 *
 * @param {*} url - The URL to start archive from.
 * @param {*} output - The output directory to save the archive to.
 * @param {*} date - The date to use for the archive directory.
 */
async function documents(url, output, date, overwrite) {
  const destination = join(output, date, "documents");
  const documentUrls = join(output, date, "document-urls");
  const documentDownloaded = join(output, date, "documents");
  const documents = await documentList(url);

  // Capture screenshot
  await screenshot(url, join(output, date, "screenshot.png"), overwrite);

  // Write data of URLs
  writeDataSync(`${documentUrls}.csv`, documents);
  writeDataSync(`${documentUrls}.json`, documents);

  // Download documents
  await downloadDocuments(documents, destination, overwrite);

  // Write data of downloads
  writeDataSync(`${documentDownloaded}.csv`, documents);
  writeDataSync(`${documentDownloaded}.json`, documents);
}

/**
 * Download, screenshot, etc materials.
 *
 * @param {*} documents - Array of objects describing documents.
 * @param {*} destination - Directory to output to.
 */
async function downloadDocuments(documents, destination, overwrite) {
  // Download each document
  for (const document of documents) {
    if (document.documentUrl) {
      const fileName = basename(document.documentUrl);
      const extension = fileName?.split(".")?.pop()?.toLowerCase();

      // Documents
      if (
        [
          "pdf",
          "doc",
          "docx",
          "xls",
          "xlsx",
          "ppt",
          "pptx",
          "png",
          "jpeg",
          "jpg",
        ].includes(extension)
      ) {
        const downloader = new Downloader({
          url: document.documentUrl,
          directory: destination,
          fileName: fileName,
          maxAttempts: 3,
          skipExistingFileName: overwrite ? false : true,
        });
        await downloader.download();

        document.archiveAction = "download";
        document.archivePath = join("documents", fileName);
      } else {
        // Take screenshot
        const screenshotFileName = `screenshot-${encodeURIComponent(
          document.documentUrl
        )}.png`;
        const localDestination = join(destination, screenshotFileName);
        await screenshot(document.documentUrl, localDestination, overwrite);

        document.archiveAction = "screenshot";
        document.archivePath = join("documents", screenshotFileName);
      }
      // else {
      //   document.archiveAction = "skip";
      // }
      // TODO: Handle other things, maybe take screenshot.
    }
  }
}

/**
 * Wrapper around taking screenshots.
 *
 * @param {*} url
 * @param {*} destination
 * @param {*} overwrite
 */
async function screenshot(url, destination, overwrite) {
  if (overwrite || !existsSync(destination)) {
    await captureWebsite.file(url, destination, {
      width: 1920,
      height: 1080,
      fullPage: true,
      overwrite: true,
    });
  }
}

/**
 * Get list of document URLs from web page.
 *
 * @param {*} url - The URL to start archive from.
 */
async function documentList(url) {
  // Get contents of the page
  const response = await fetch(url);

  // Check
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Get and parse the HTML
  const contents = await response.text();
  const html = parse(contents);

  // A simple approach would be to look for any list items with links
  // in them, but we want to keep the hierarchy data.

  // In between <a name="1" id="1"></a> and <a href="#top"> is a section
  const contentContainer = html.querySelector(".middlecopy");
  const topLevelItems = contentContainer.childNodes;

  // Loop through the top level items and create sections
  const sections = [];
  topLevelItems.forEach((n) => {
    const nameAttr = parseInt(n.attributes?.name);
    if (n.tagName === "A" && nameAttr > 0) {
      sections.push([]);
    }

    if (sections[sections.length - 1]) {
      sections[sections.length - 1].push(n);
    }
  });

  // Loop through the sections and create documents
  const documents = [];
  sections.forEach((section) => {
    // Get title
    const sectionTitle = section.reduce((memo, n) => {
      if (n.tagName === "H2") {
        return n.text;
      }
      return memo;
    }, "");

    // Look for lists
    section.forEach((item) => {
      // Go through any lists
      if (item.tagName === "OL") {
        item.childNodes.forEach((listItem) => {
          const itemText = parseItemText(listItem);
          const { documentType, documentUrl } = findDocument(listItem);

          // Is there another level
          const subList = listItem.childNodes.find((c) => c.tagName === "OL");
          if (subList) {
            subList.childNodes.forEach((subListItem) => {
              const subListItemText = parseItemText(subListItem);
              const { documentType, documentUrl } = findDocument(subListItem);

              // Is there another level
              const subSubList = subListItem.childNodes.find(
                (c) => c.tagName === "OL"
              );
              if (subSubList) {
                subSubList.childNodes.forEach((subListItem) => {
                  const subSubListItemText = parseItemText(subListItem);
                  const { documentType, documentUrl } =
                    findDocument(subListItem);

                  if (subSubListItemText) {
                    // Add sub sub item
                    documents.push({
                      section: sectionTitle,
                      item: itemText,
                      subItem: subListItemText,
                      subSubItem: subSubListItemText,
                      documentType,
                      documentUrl,
                    });
                  }
                });
              } else if (subListItemText) {
                // Add sub item
                documents.push({
                  section: sectionTitle,
                  item: itemText,
                  subItem: subListItemText,
                  subSubItem: null,
                  documentType,
                  documentUrl,
                });
              }
            });
          } else if (itemText) {
            // No more levels, add document
            documents.push({
              section: sectionTitle,
              item: itemText,
              subItem: null,
              subSubItem: null,
              documentType,
              documentUrl,
            });
          }
        });
      }
    });
  });

  return documents;
}

/**
 * Try to find any direct links in a list item.
 *
 * @param {*} listItem
 * @returns
 */
function findDocument(listItem) {
  // TODO: Check that this element is a direct child (not a nested link in another list)
  const link = parse(listItem).querySelector("a");
  if (link) {
    return {
      documentType: link.text,
      documentUrl: link.attributes.href,
    };
  }
  return {};
}

/**
 * Get the text of a list item minus any OL.
 *
 * @param {*} listItem - Node
 */
function parseItemText(listItem) {
  return listItem.childNodes.reduce((memo, c) => {
    if (c.tagName !== "OL") {
      memo = memo + " " + c.text;
    }
    return memo.trim();
  }, "");
}

export default documents;
