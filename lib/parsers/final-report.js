// Dependencies
import { readFileSync } from "fs";
import { join as pathJoin, dirname } from "path";
import { parse as urlParse, fileURLToPath } from "url";
import { parse } from "node-html-parser";

// Local
const __dirname = dirname(fileURLToPath(import.meta.url));

// Raw HTML
const htmlPath = pathJoin(
  __dirname,
  "..",
  "..",
  "data",
  "final-report",
  "Report_FinalReport_Jan6SelectCommittee.html"
);

/**
 * Parser for final report.
 * https://january6th.house.gov/sites/democrats.january6th.house.gov/files/Introductory%20Material%20to%20the%20Final%20Report%20of%20the%20Select%20Committee2.pdf
 *
 * Had to manually parse to HTML with Adobe Reader so that links can
 * accurately be parsed.  Was unable to find a away with PDF.js or other
 * Node-based PDF parsers to get into a way to accurately parse the links.
 *
 * @param {*} page - Page object with url key
 */
export default async function finalReport(page, overwrite) {
  // Get HTML
  const fileContents = readFileSync(htmlPath, "utf8");

  // Parse HTML
  const html = parse(fileContents);

  // Get links
  const links = html.querySelectorAll("a");

  // Setup materials list
  let materials = [];

  // Collect links
  links.forEach((l) => {
    if (l.attributes.href && l.attributes.href.trim().match(/^[^#]/)) {
      materials.push({
        page_type: "final-report",
        title: null,
        material_text: l.text.trim(),
        material_url: l.attributes.href.trim(),
        material_date: null,
      });
    }
  });

  // Make unique by length of text
  let uniqueMaterials = {};
  materials.forEach((m) => {
    if (
      !uniqueMaterials[m.material_url] ||
      uniqueMaterials[m.material_url].material_text.length <
        m.material_text.length
    ) {
      uniqueMaterials[m.material_url] = m;
    }
  });
  materials = Object.values(uniqueMaterials);

  // Some fixes
  materials = materials.map((m) => {
    const hostName = urlParse(m.material_url).hostname;

    // Justice.gov download does not have a file extension, so assume PDF
    // https://lostnotstolen.org/download/378/
    if (
      m.material_url.match(
        /(justice\.gov.*download|lostnotstolen\.org.*download)/i
      )
    ) {
      m.material_type = "pdf";
    }

    // Youtube timestamps are added, but we download the whole video, and this can be a problem
    // when downloading large files that are duplicated.  So remove the timestamp.
    if (hostName.match(/youtube|youtu\.be/i)) {
      m.material_url_original = m.material_url;
      m.material_url = m.material_url.replace(/(\?|&)t=\d+s?/, "");
    }

    return m;
  });

  // Remove some things
  materials = materials.filter((m) => {
    // Remove blank youtube links
    if (m.material_url.match(/(youtube\.com.?$|youtu.?be\.com.watch.v$)/i)) {
      return false;
    }

    return true;
  });

  return materials;
}
