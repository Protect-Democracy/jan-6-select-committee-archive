// Dependencies
import { cacheDirectory } from "../config.js";
import { fetchBuilder, FileSystemCache } from "node-fetch-cache";
import { parse as parseHtml } from "node-html-parser";
import { parse as parseDate, formatISO } from "date-fns";

// Constants
const fetch = fetchBuilder.withCache(
  new FileSystemCache({
    cacheDirectory: cacheDirectory,
    ttl: 1000 * 60 * 60 * 12,
  })
);

/**
 * Parser for GPO materials.
 * https://www.govinfo.gov/collection/january-6th-committee-final-report
 *
 * @param {*} source - Source object with url key
 */
export default async function gpoMaterials(source) {
  const topLevelTreeData =
    "https://www.govinfo.gov/wssearch/rb/gpo/January%206th%20Committee%20Final%20Report%20and%20Supporting%20Materials%20Collection?fetchChildrenOnly=1";
  const pathSearch =
    "https://www.govinfo.gov/wssearch/rb//gpo/[[SEARCH_PATH]]?fetchChildrenOnly=1";
  const pathFile = "https://www.govinfo.gov/content/pkg/[[FILE_PATH]]";
  const pathDetails = "https://www.govinfo.gov/app/details/[[MATERIAL_ID]]/";
  const materials = [];

  // Top level
  const topTree = await getJson(topLevelTreeData);
  const headings = topTree.childNodes;

  // Main headings
  for (const heading of headings) {
    if (!heading.nodeValue && !heading.nodeValue.browsePathAlias) {
      return;
    }

    // Get child data
    const childData = await getJson(
      pathSearch.replace("[[SEARCH_PATH]]", heading.nodeValue.browsePathAlias)
    );
    for (const child of childData.childNodes) {
      const values = child.nodeValue;
      const isMp4 = values.other1file && values.other1file.match(/\.mp4$/i);

      let material = {
        id: `${source.id}--${values.packageid}`,
        source_material_id: values.packageid,
        title: values.title,
        description: stripHtml(values.browseline2),
        section: values.browsePath,
        url: pathFile.replace(
          "[[FILE_PATH]]",
          values.pdffile || values.other1file
        ),
        date: values.publishdate ? parseDateIso(values.publishdate) : null,
        details_url: pathDetails.replace("[[MATERIAL_ID]]", values.packageid),
      };

      // The Mp4 files are actually streaming links and not direct files, so need
      // to mark here how to handle when we do the actual preservation.  Do this
      // like this to not overwrite existing material data.
      if (isMp4) {
        material.preserve_action = "download-streaming-video";
      }

      if (!values.pdffile && !values.other1file) {
        console.error(values);
        console.error(material);
        throw new Error("Unable to find link to file.");
      }
      materials.push(material);
    }
  }

  return materials;
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

function stripHtml(input) {
  const html = parseHtml(input);
  return html.text;
}

function parseDateIso(input) {
  const date = parseDate(input, "MMMM d, yyyy", new Date(1970, 1, 1, 0, 0, 0));
  return formatISO(date, { representation: "date" });
}
