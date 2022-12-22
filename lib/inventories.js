// Dependencies
import {
  writeDataSync,
  existsSync,
  readDataSync,
  makeDirectoriesSync,
} from "indian-ocean";
import { join as pathJoin } from "path";

/**
 * Update top-level inventory entry.
 * /ARCHIVE_BASE/inventory.json
 *
 * @param {*} destination - Location of archive
 * @param {*} inventoryEntries - New entries to update or add in format { "id": { ... }, "id2": { ... } }
 */
function archiveInventoryUpdate(destination, inventoryEntries) {
  const fileName = pathJoin(destination, "inventory.json");
  const fileNameCsv = pathJoin(destination, "inventory.csv");
  const currentInventory = existsSync(fileName) ? readDataSync(fileName) : {};
  const updateEntries = { ...currentInventory, ...inventoryEntries };
  makeDirectoriesSync(fileName);
  writeDataSync(fileName, updateEntries);
  writeDataSync(fileNameCsv, Object.values(updateEntries));
}

/**
 * Update date-level inventory entry.
 * /ARCHIVE_BASE/DATE/inventory.json
 *
 * @param {*} destination - Location of archive
 * @param {*} date - Date of archive
 * @param {*} inventoryEntries - New entries to update or add in format [{ "id": "" }, ... ]
 */
function dateInventoryUpdate(destination, date, inventoryEntries) {
  const fileName = pathJoin(destination, date, "inventory.json");
  const fileNameCsv = pathJoin(destination, date, "inventory.csv");
  makeDirectoriesSync(fileName);
  writeDataSync(fileName, inventoryEntries);
  writeDataSync(fileNameCsv, inventoryEntries);
}

export { archiveInventoryUpdate, dateInventoryUpdate };
