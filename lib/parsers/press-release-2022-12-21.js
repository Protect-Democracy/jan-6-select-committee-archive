// Dependencies
import fetch from "node-fetch";
import { parse } from "node-html-parser";

/**
 * Parser for press release.
 * https://january6th.house.gov/news/press-releases/release-select-committee-materials
 *
 * @param {*} page - Page object with url key
 */
export default async function pressRelease20221221(page) {
  // Selector is not that specific
  const selector = ".boxton-content-region .field-name-body";

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
  const mainContent = html.querySelector(selector);

  // Look for links
  const paragraphs = mainContent.querySelectorAll("p");
  paragraphs.forEach((p) => {
    const links = p.querySelectorAll("a");
    links.forEach((l) => {
      materials.push({
        page_type: "press-release",
        title: `Witness testimony ${p.text.trim()}`,
        material_text: l.text.trim(),
        material_url: l.attributes.href.trim(),
      });
    });
  });

  return materials;
}
