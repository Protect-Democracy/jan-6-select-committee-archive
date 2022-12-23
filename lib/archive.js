/**
 * Top level archive function
 */

// Dependencies
import { makeDirectoriesSync, readDataSync } from "indian-ocean";
import { join as pathJoin } from "path";
import { archiveUrlBase, pages } from "./config.js";
import { outputTopItem } from "./output.js";
import archivePage from "./archive-page.js";
import { archiveInventoryUpdate, dateInventoryUpdate } from "./inventories.js";
import screenshot from "./screenshot.js";
import zip from "./zip.js";

/**
 * Top level archive
 *
 * @param {*} destination
 * @param {*} date
 */
async function archive(destination, date, overwrite) {
  // Make sure we have our directories
  makeDirectoriesSync(destination, date);

  // Archive (over time) inventory
  const archiveInventory = {
    [date]: {
      id: date,
      date: date,
      materials: [],
      inventory: `${archiveUrlBase}/${pathJoin(date, "inventory.json")}`,
      archive_file: `${archiveUrlBase}/${pathJoin(date, `${date}.zip`)}`,
      archive_site: `${archiveUrlBase}/${pathJoin(
        date,
        `${date}-january6th.house.gov.zip`
      )}`,
      started: new Date().getTime(),
      started_datetime: new Date().toISOString(),
    },
  };

  // Date inventory
  outputTopItem(`Archiving ${date}...`);
  let dateInventory = [];

  // Go through and archive each page
  for (const page of pages) {
    // Archive page
    outputTopItem(`Archiving ${page.id}...`);
    const materials = await archivePage(page, destination, date, overwrite);

    // Screenshot
    await screenshot(
      page.url,
      pathJoin(destination, date, `${page.id}-screenshot.png`),
      overwrite
    );

    // Update inventories
    dateInventory = materials;
    archiveInventory[date].materials =
      archiveInventory[date].materials.concat(dateInventory);
  }

  // Update date inventory
  dateInventoryUpdate(destination, date, dateInventory);

  // Create archive of date inventory
  outputTopItem(`Creating zip archive of materials...`);
  await zip(
    { glob: pathJoin(destination, date, "**/*") },
    pathJoin(destination, date, `${date}.zip`),
    overwrite
  );

  // Update archive inventory
  archiveInventory[date].materials_count =
    archiveInventory[date].materials.length;
  archiveInventory[date].completed = new Date().getTime();
  archiveInventory[date].completed_datetime = new Date().toISOString();
  archiveInventoryUpdate(destination, archiveInventory);
}

export default archive;
