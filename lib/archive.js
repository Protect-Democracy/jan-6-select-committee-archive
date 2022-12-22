/**
 * Top level archive function
 */

// Dependencies
import { makeDirectoriesSync, readDataSync } from "indian-ocean";
import { join as pathJoin, dirname } from "path";
import { fileURLToPath } from "url";
import { archiveUrlBase } from "./config.js";
import { outputTopItem } from "./output.js";
import archivePage from "./archive-page.js";
import { archiveInventoryUpdate, dateInventoryUpdate } from "./inventories.js";

// Constants
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Top level archive
 *
 * @param {*} destination
 * @param {*} date
 */
async function archive(destination, date, overwrite) {
  // Make sure we have our directories
  makeDirectoriesSync(destination, date);

  // Read in list of pages
  const pagesPath = pathJoin(
    __dirname,
    "..",
    "data",
    "select-committee-pages.csv"
  );
  const pages = readDataSync(pagesPath);

  // Archive (over time) inventory
  const archiveInventory = {
    [date]: {
      id: date,
      date: date,
      materials: [],
      inventory: `${archiveUrlBase}/${pathJoin(date, "inventory.json")}`,
      //archive_file: `${archiveUrlBase}/${pathJoin(date, `${date}.zip`)}`,
      //archive_site: `${archiveUrlBase}/${pathJoin(date, `${date}-january6th.house.gov.zip`)}`,
      started: new Date().getTime(),
      started_datetime: new Date().toISOString(),
    },
  };

  // Date inventory
  let dateInventory = [];

  // Go through and archive each page
  for (const page of pages) {
    // Archive page
    outputTopItem(`Archiving ${page.id}...`);
    const materials = await archivePage(page, destination, date, overwrite);

    // Update inventories
    dateInventory = materials;
    archiveInventory[date].materials = dateInventory;
  }

  // Update date inventory
  dateInventoryUpdate(destination, date, dateInventory);

  // Update archive inventory
  archiveInventory[date].completed = new Date().getTime();
  archiveInventory[date].completed_datetime = new Date().toISOString();
  archiveInventoryUpdate(destination, archiveInventory);
}

export default archive;
