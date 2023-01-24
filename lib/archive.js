/**
 * Top level archive function
 */

// Dependencies
import { makeDirectoriesSync, existsSync } from "indian-ocean";
import { join as pathJoin } from "path";
import { archiveUrlBase, sources } from "./config.js";
import { outputTopItem, outputItem, outputDone } from "./output.js";
import archiveSource from "./archive-source.js";
import preserveMaterial from "./preserve-material.js";
import {
  copyBackupArchive,
  getArchiveInventory,
  archiveInventoryUpdate,
  dateInventoryUpdate,
} from "./inventories.js";
import { keyBy, groupBy, each } from "lodash-es";

/**
 * Top level archive
 *
 * @param {*} destination
 * @param {*} date
 */
async function archive(destination, date, overwrite, sourceId = null) {
  // Make sure we have our directories
  makeDirectoriesSync(destination, date);

  // Make backup of archive inventory
  copyBackupArchive(destination);

  // Read current archive inventory
  let archiveInventory = getArchiveInventory(destination);

  // Read current materials list
  let existingMaterials = archiveInventory[date]?.materials || [];

  // Setup inventory
  archiveInventory[date] = {
    first_run_started: new Date().getTime(),
    first_run_started_datetime: new Date().toISOString(),
    materials: [],
    ...(archiveInventory[date] || {}),
    id: date,
    date: date,
    inventory: pathJoin(date, "inventory.json"),
    inventory_csv: pathJoin(date, "inventory.csv"),
    inventory_hosted: `${archiveUrlBase}/${pathJoin(date, "inventory.json")}`,
    inventory_csv_hosted: `${archiveUrlBase}/${pathJoin(
      date,
      "inventory.csv"
    )}`,
  };

  // Date inventory
  outputTopItem(`Archiving ${date}`);

  // Get materials from each source
  outputTopItem(`Collecting materials...`);
  let newMaterials = [];
  for (const source of sources) {
    if (sourceId && sourceId !== source.id) {
      continue;
    }

    // Archive page
    outputItem(`Collecting materials from ${source.id}...`);
    const sourceMaterials = await archiveSource(
      source,
      destination,
      date,
      overwrite
    );
    outputItem(
      `Collected ${sourceMaterials.length} materials from ${source.id}.`,
      {
        status: "done",
        update: true,
      }
    );

    // Update inventories
    newMaterials = newMaterials.concat(sourceMaterials);
  }

  // Reconcile existing and new materials
  // TODO: Probably some better way to do this
  let materials = [];
  let existingMaterialsById = keyBy(existingMaterials, "id");
  let newMaterialsById = keyBy(newMaterials, "id");
  // Combine and update existing materials
  existingMaterials.forEach((m) => {
    materials.push({
      ...m,
      ...(newMaterialsById[m.id] || {}),
    });
  });
  // Add new materials
  newMaterials.forEach((m) => {
    if (!existingMaterialsById[m.id]) {
      materials.push(m);
    }
  });

  // Update count
  archiveInventory[date].materials_count = materials.length;

  // Preserve each material
  outputTopItem(`Preserving ${materials.length} materials...`);
  let materialCount = 0;
  for (let material of materials) {
    materialCount++;
    outputItem(
      `[${materialCount}/${materials.length}] Preserving ${material.id} [${material.url}]`
    );

    material = await preserveMaterial(material, destination, date, overwrite);

    outputItem(
      `[${materialCount}/${materials.length}] Preserved ${material.id} [${material.last_preserve_action}]`,
      {
        status:
          material.last_preserve_action === "error"
            ? "error"
            : material.last_preserve_action === "skipped"
            ? null
            : "done",
        update: true,
      }
    );

    // Update archive inventory as we go
    archiveInventory[date].materials = materials;
    archiveInventoryUpdate(destination, archiveInventory);
    dateInventoryUpdate(destination, date, materials);
  }

  // Materials preserved
  outputTopItem(`Preserved ${materials.length} materials.`);
  each(groupBy(materials, "last_preserve_action"), (group, action) => {
    outputItem(`${action}: ${group.length}`);
  });

  // Create archive of date inventory.
  // TODO: Be able to check if other files have changed and overwrite if
  // necessary.

  // outputTopItem(`Creating zip archive of materials...`);
  // await zip(
  //   { glob: pathJoin(destination, date, "**/*") },
  //   pathJoin(destination, date, `${date}.zip`),
  //   true
  // );

  // Update archive inventory
  outputTopItem(`Finalizing inventory....`);
  archiveInventory[date].last_run_completed = new Date().getTime();
  archiveInventory[date].last_run_completed_datetime = new Date().toISOString();
  archiveInventoryUpdate(destination, archiveInventory);

  outputDone();
}

export default archive;
