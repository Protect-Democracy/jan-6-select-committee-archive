// Dependencies
import { basename } from "path";
import fetch from "node-fetch";
import { parse } from "node-html-parser";

/**
 * Parser for press release.
 * https://january6th.house.gov/news/press-releases/release-select-committee-materials-2
 *
 * @param {*} page - Page object with url key
 */
export default async function pressRelease20221223(page) {
  // Selector is not that specific
  const mainSelector = ".boxton-content-region .field-name-body";

  // Get contents of the page
  const response = await fetch(page.url);

  // Check
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Get and parse the HTML
  const contents = await response.text();
  const html = parse(contents);

  // Setup materials list
  const materials = [];

  // Get main content
  const mainContent = html.querySelector(mainSelector);

  // Look for list items
  const listItems = mainContent.querySelectorAll("ul li");
  listItems.forEach((li) => {
    const links = li.querySelectorAll("a");
    links.forEach((l) => {
      // Attempt to get date from url
      const materialFileName = basename(l.attributes.href.trim());
      const dateParsed = materialFileName.match(/^(\d{4})(\d{2})(\d{2})/);

      materials.push({
        page_type: "press-release",
        title: `Witness testimony ${li.text.trim()}`,
        material_text: l.text.trim(),
        material_url: l.attributes.href.trim(),
        material_date: dateParsed
          ? `${dateParsed[1]}-${dateParsed[2]}-${dateParsed[3]}`
          : null,
      });
    });
  });

  return materials;
}
