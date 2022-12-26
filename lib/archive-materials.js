/**
 * Direct download of materials.
 */

// Dependencies
import { join as pathJoin } from "path";
import { archiveUrlBase } from "./config.js";
import preserveMaterial from "./preserve-materials.js";
import { outputProgress } from "./output.js";

/**
 * Archive set of materials.
 *
 * @param {*} materials
 * @param {*} destination
 * @param {*} date
 */
async function archiveMaterials(materials, destination, date, overwrite) {
  // Add some common information
  materials = materials.map((material) => {
    return {
      source: "https://january6th.house.gov/",
      page_id: "direct-materials",
      date: date,
      ...material,
      parsed: new Date().getTime(),
      parsed_datetime: new Date().toISOString(),
    };
  });

  // Download materials
  let counter = 0;
  for (const material of materials) {
    await preserveMaterial(
      material,
      pathJoin(destination, date, "direct-materials"),
      `${archiveUrlBase}/${pathJoin(date, "direct-materials")}`,
      overwrite
    );

    counter++;
    outputProgress(
      "direct-materials",
      `Preserving ${materials.length} materials directly`,
      counter,
      materials.length,
      "top"
    );
  }

  return materials;
}

export default archiveMaterials;
