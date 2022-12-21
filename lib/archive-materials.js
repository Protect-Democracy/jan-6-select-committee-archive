// Dependencies
import { join, basename } from "path";
import fetch from "node-fetch";
import { parse } from "node-html-parser";
import { writeDataSync, existsSync } from "indian-ocean";
import Downloader from "nodejs-file-downloader";
import captureWebsite from "capture-website";

/**
 * Archive materials locally
 *
 * @param {*} url - The URL to start archive from.
 * @param {*} output - The output directory to save the archive to.
 * @param {*} date - The date to use for the archive directory.
 */
async function archiveMaterials(url, output, date, overwrite) {
  const materialsDestination = join(output, date, "materials");
  const materialsToArchivePath = join(output, date, "materials-to-archive");
  const materialsArchivedPath = join(output, date, "materials-archived");

  // Capture screenshot
  await screenshot(url, join(output, date, "screenshot.png"), overwrite);

  // Parse HTML into structured data
  const materials = await parseMaterials(url);

  // Output materials list
  outputMaterialsList(materials, materialsToArchivePath);

  // Download documents
  await preserveMaterials(materials, materialsDestination, overwrite);

  // Output materials list
  outputMaterialsList(materials, materialsArchivedPath);
}

/**
 * Write materials data to a JSON and a flattened CSV.
 *
 * @param {*} materials
 * @param {*} destination
 */
function outputMaterialsList(materials, destination) {
  // Output JSON as nested
  writeDataSync(`${destination}.json`, materials);

  // Flatten for CSV
  const flatten = (items, level, collection, row) => {
    row = simpleClone(row);

    items.forEach((item) => {
      row[`${level}_level`] = item.title;
      // Check for links
      if (item.links) {
        row.material_type = item.links[0].text;
        row.material_url = item.links[0].url;

        // Ensure in case there are multiple links
        if (item.links.length > 1) {
          row.all_links = item.links.map((link) => link.url).join(", ");
        }
      }

      // Check for more items
      if (item.items) {
        flatten(item.items, level + 1, collection, row);
      } else {
        collection.push(row);
        row = {
          ...row,
          [`${level}_level`]: undefined,
          material_type: undefined,
          material_url: undefined,
          all_links: undefined,
        };
      }
    });
  };

  const flattened = [];
  // Initialize for nicer CSV output
  flatten(materials, 0, flattened, {
    "0_level": null,
    "1_level": null,
    "2_level": null,
    "3_level": null,
    material_type: null,
    material_url: null,
  });

  // Output CSV as flattened
  writeDataSync(`${destination}.csv`, flattened);
}

/**
 * Download, screenshot, etc materials.
 *
 * @param {*} documents - Array of objects describing documents.
 * @param {*} destination - Directory to output to.
 */
async function preserveMaterials(materials, destination, overwrite) {
  // Recursive download function
  const preserveItems = async (items) => {
    for (const item of items) {
      // Check links
      if (item.links) {
        for (const link of item.links) {
          await preserveLink(link);
        }
      }

      // Check for more items
      if (item.items) {
        await preserveItems(item.items);
      }
    }
  };

  // Download a single link
  const preserveLink = async (link) => {
    const fileName = basename(link.url);
    const extension = fileName?.split(".")?.pop()?.toLowerCase();

    console.log(`Preserving ${link.url}...`);

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
        url: link.url,
        directory: destination,
        fileName: fileName,
        maxAttempts: 3,
        skipExistingFileName: overwrite ? false : true,
      });
      await downloader.download();

      link.archive_action = "download";
      link.archive_path = join("materials", fileName);
    } else {
      // Take screenshot
      const screenshotFileName = `screenshot-${encodeURIComponent(
        link.url
      )}.png`;
      const localDestination = join(destination, screenshotFileName);
      await screenshot(link.url, localDestination, overwrite);

      link.archive_action = "screenshot";
      link.archive_path = join("materials", screenshotFileName);
    }
    // else {
    //   document.archiveAction = "skip";
    // }
    // TODO: Handle other things, maybe take screenshot.
  };

  // Preserve all items
  await preserveItems(materials);
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
async function parseMaterials(url) {
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

  // Loop through the sections and create nested set of materials
  const materials = [];
  sections.forEach((section) => {
    const item = {};

    // Get title
    item.title = section.reduce((memo, n) => {
      if (n.tagName === "H2") {
        return n.text;
      }
      return memo;
    }, "");

    // Look for lists
    section.forEach((c) => {
      if (c.tagName === "OL") {
        item.items = parseList(c);
      }
    });

    materials.push(item);
  });

  return materials;
}

/**
 * Recursively parse ul/ol list of items.
 *
 * @param {*} listElement
 * @returns {Array} - Array of items
 */
function parseList(listElement) {
  const items = [];

  listElement.childNodes.forEach((listItem) => {
    // Ignore any none list items
    if (listItem.tagName !== "LI") {
      return;
    }

    // Item
    const item = {};

    // Get any text
    item.title = listItem.childNodes.reduce((memo, c) => {
      if (c.tagName !== "OL" && c.tagName !== "UL") {
        memo = memo + " " + c.text;
      }
      return memo.trim();
    }, "");

    // Get any non-list links
    listItem.childNodes.forEach((c) => {
      // Ignore any links that are within another list
      if (c.tagName !== "OL" && c.tagName !== "UL") {
        const links = parse(c).querySelectorAll("a");
        links.forEach((link) => {
          // At least one link is a duplicate with a blank text
          if (link.text.trim() === "") {
            return;
          }

          item.links = item.links || [];
          item.links.push({
            text: link.text,
            url: link.attributes.href,
          });
        });
      }
    });

    // Parse any sub items
    listItem.childNodes.forEach((c) => {
      // TODO: Should we really support the idea of multiple nested lists
      if (c.tagName === "OL" || c.tagName === "UL") {
        item.items = parseList(c);
      }
    });

    items.push(item);
  });

  return items;
}

/**
 * Simple clone function.
 *
 * @param {*} obj
 * @returns
 */
function simpleClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default archiveMaterials;
