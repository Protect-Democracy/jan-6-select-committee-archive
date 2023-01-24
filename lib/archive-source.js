/**
 * Archive page
 */

// Dependencies
import parsers from "./parsers/index.js";

/**
 * Archive source.  See data/sources.csv for the list to handle.
 *
 * @param {*} source
 * @param {*} destination
 * @param {*} date
 * @param {*} overwrite
 */
async function archiveSource(source, destination, date, overwrite) {
  // Setup materials
  let materials = [];

  // Make an entry for a screenshot of source
  materials.push({
    id: `${source.id}--screenshot`,
    source: source.url,
    source_id: source.id,
    title: `Screenshot of ${source.url}`,
    url: source.url,
    type: "screenshot",
    source_parsed: new Date().getTime(),
    source_parsed_datetime: new Date().toISOString(),
  });

  // If a site archive, add that material
  if (source.type === "website-archive") {
    materials.push({
      id: `${source.id}--archive`,
      source: source.url,
      source_id: source.id,
      title: `Full website archive of ${source.url}`,
      url: source.url,
      type: "website-archive",
      source_parsed: new Date().getTime(),
      source_parsed_datetime: new Date().toISOString(),
    });
  }

  // If a set of materials, run parser
  if (source.type === "materials") {
    // Parse page
    if (!parsers[source.id]) {
      throw new Error(`Parser ${source.id} not found.`);
    }
    const parser = parsers[source.id];
    let parsedMaterials = await parser(source);

    // Add some common information
    parsedMaterials = parsedMaterials.map((material) => {
      return {
        source: source.url,
        source_id: source.id,
        ...material,
        source_parsed: new Date().getTime(),
        source_parsed_datetime: new Date().toISOString(),
      };
    });

    // Combine materials
    materials = materials.concat(parsedMaterials);
  }

  return materials;
}

export default archiveSource;
