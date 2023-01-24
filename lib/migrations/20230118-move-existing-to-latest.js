/**
 * Migrate materials to a singluar latest version.  Migration as it would be
 * significant time and bandwidth to download the bulk of the materials again.
 */

// Dependencies
import { readDataSync, makeDirectoriesSync, writeDataSync } from "indian-ocean";
import { join as pathJoin, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, renameSync } from "fs";
import { minBy } from "lodash-es";
import { cliInput } from "../utils.js";

// Local
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 *
 */
export default async function migration20230118() {
  // Existing set
  const existingSetId = "2023-01-03";

  // Get inventory
  const inventoryPath = pathJoin(
    __dirname,
    "..",
    "..",
    "output",
    "inventory.json"
  );
  const inventory = readDataSync(inventoryPath);

  // Existing set
  const existingSet = inventory[existingSetId];

  // Existing materials
  // {
  // source: 'https://www.govinfo.gov/collection/january-6th-committee-final-report',
  // page_id: 'gpo-materials',
  // date: '2023-01-03',
  // section: 'January 6th Committee Final Report and Supporting Materials Collection/Supporting Materials - Documents on File with the Select Committee',
  // page_type: 'gpo-material',
  // title: 'CTRL0000036629_00022 - (National Archives Production), P-R000286 (January 6, 2021, note from Nicholas Luna to President Trump).',
  // material_id: 'GPO-J6-DOC-CTRL0000036629_00022',
  // material_text: 'Supporting Materials Referenced in H. Rept. 117-663. Documents on File with the Select Committee.. Wednesday, January 6, 2021.',
  // material_url: 'https://www.govinfo.gov/content/pkg/GPO-J6-DOC-CTRL0000036629_00022/pdf/GPO-J6-DOC-CTRL0000036629_00022.pdf',
  // material_type: null,
  // material_date: '2021-01-06',
  // material_details_url: 'https://www.govinfo.gov/app/details/GPO-J6-DOC-CTRL0000036629_00022/',
  // parsed: 1672796448382,
  // parsed_datetime: '2023-01-04T01:40:48.382Z',
  // preserve_started: 1672796458229,
  // preserve_started_datetime: '2023-01-04T01:40:58.229Z',
  // preserve_action: 'download',
  // preserve_path: 'https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-03/gpo-materials/GPO-J6-DOC-CTRL0000036629_00022.pdf',
  // preserve_completed: 1672796458230,
  // preserve_completed_datetime: '2023-01-04T01:40:58.230Z'
  // }
  let toMigrate = existingSet.materials
    .filter((m) => m.page_id === "gpo-materials")
    .filter((m) => m.preserve_action !== "skipped")
    .map((m) => {
      const extension = m.material_url.split(".").pop();
      const id = `${m.page_id}--${m.material_id}`;

      const newMaterial = {
        id: id,
        source: m.source,
        source_id: m.page_id,
        source_material_id: m.material_id,
        title: m.title,
        description: m.material_text,
        section: m.section,
        url: m.material_url,
        type:
          extension === "mp4"
            ? "video"
            : extension === "mp3"
            ? "audio"
            : "document",
        date: m.material_date,
        details_url: m.material_details_url,
        source_parsed: m.parsed,
        source_parsed_datetime: m.parsed_datetime,
        preserve_action:
          m.preserve_action === "download-youtube"
            ? "download-streaming-video"
            : m.preserve_action,
        preserve_started: m.preserve_started,
        preserve_started_datetime: m.preserve_started_datetime,
        preserve_completed: m.preserve_completed,
        preserve_completed_datetime: m.preserve_completed_datetime,
        preserve_path: `${m.page_id}/${id}.${extension}`,
        preserve_path_hosted: `https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/latest/${m.page_id}/${id}.${extension}`,
        migration_source: m.preserve_path
          .replace(
            "https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-03/gpo-materials/output/",
            "output/"
          )
          .replace(
            "https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/",
            "output/"
          ),
      };

      return newMaterial;
    });
  console.info(toMigrate.length, "GPO materials found.");

  // Ensure files are there and filter out any that are not
  toMigrate = toMigrate.filter((m) => {
    return existsSync(m.migration_source);
  });
  console.info(toMigrate.length, "Existing files to migrate.");

  // Double check
  const sure = await cliInput(
    `Are you sure you want to migrate these ${toMigrate.length} files? (y/n): `
  );
  if (!sure.match(/y/i)) {
    process.exit(2);
  }

  // Move files
  console.info(toMigrate.length, "Moving files.");
  toMigrate.forEach((m) => {
    const toPath = pathJoin("output", "latest", m.preserve_path);
    makeDirectoriesSync(toPath);
    renameSync(m.migration_source, toPath);
  });

  // Remove migration_source from inventory
  toMigrate = toMigrate.map((m) => {
    delete m.migration_source;
    return m;
  });

  // Update inventory
  inventory.latest = {
    id: "latest",
    first_run_started: minBy(toMigrate, "source_parsed").source_parsed,
    first_run_started_datetime: minBy(toMigrate, "source_parsed")
      .source_parsed_datetime,
    last_run_completed: new Date().getTime(),
    last_run_completed_datetime: new Date().toISOString(),
    materials: toMigrate,
  };
  writeDataSync(pathJoin("output", "inventory.json"), inventory);
  console.info(toMigrate.length, "Moved files and wrote inventory.");
}
