/**
 * Archive page
 */

// Dependencies
import { join as pathJoin } from "path";
import { archiveUrlBase } from "./config.js";
import parsers from "./parsers/index.js";
import preserveMaterial from "./preserve-materials.js";

/**
 * Archive page.
 *
 * @param {*} page
 * @param {*} destination
 * @param {*} date
 * @param {*} overwrite
 */
async function archivePage(page, destination, date, overwrite) {
  // Parse page
  if (!parsers[page.id]) {
    throw new Error(`Parser ${page.id} not found.`);
  }
  const parser = parsers[page.id];
  let materials = await parser(page);

  // Add some common information
  materials = materials.map((material) => {
    return {
      source: page.url,
      page_id: page.id,
      ...material,
      parsed: new Date().getTime(),
      parsed_datetime: new Date().toISOString(),
    };
  });

  // Download materials
  for (const material of materials) {
    await preserveMaterial(
      material,
      pathJoin(destination, date, page.id),
      `${archiveUrlBase}/${pathJoin(date, page.id)}`,
      overwrite
    );
  }

  return materials;
}

export default archivePage;
