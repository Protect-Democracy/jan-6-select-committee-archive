// Dependencies
import {
  writeDataSync,
  existsSync,
  readDataSync,
  makeDirectoriesSync,
} from "indian-ocean";
import { join as pathJoin, dirname } from "path";
import { fileURLToPath } from "url";
import { cloneDeep } from "lodash-es";

// Local
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Get contents of archive inventory.
 * /ARCHIVE_BASE/inventory.json
 *
 * @param {*} destination - Location of archive
 * @returns Empty object or parsed existing inventory.
 */
function getArchiveInventory(destination) {
  const fileName = pathJoin(destination, "inventory.json");
  const currentInventory = existsSync(fileName) ? readDataSync(fileName) : {};
  return currentInventory;
}

/**
 * Make copy of inventory just in case.
 * .cache/inventories/inventory.json
 *
 * @param {*} destination - Location of archive to backup
 */
function copyBackupArchive(destination) {
  const archivePath = pathJoin(destination, "inventory.json");
  const copyPath = pathJoin(
    __dirname,
    "..",
    ".cache",
    "inventories",
    `${new Date().getTime()}-inventory.json`
  );
  const currentInventory = existsSync(archivePath)
    ? readDataSync(archivePath)
    : {};
  makeDirectoriesSync(copyPath);
  writeDataSync(copyPath, currentInventory);
}

/**
 * Update top-level inventory
 * /ARCHIVE_BASE/inventory.json
 *
 * @param {*} destination - Location of archive
 * @param {*} inventoryEntries - New entries to update or add in format { "id": { ... }, "id2": { ... } }
 */
function archiveInventoryUpdate(destination, inventoryEntries) {
  const fileName = pathJoin(destination, "inventory.json");
  const fileNameCsv = pathJoin(destination, "inventory.csv");
  makeDirectoriesSync(fileName);
  writeDataSync(fileName, inventoryEntries);

  // For CSV, remove material entries
  const inventoryEntriesClone = cloneDeep(inventoryEntries);
  const csvEntries = Object.values(inventoryEntriesClone).map((entry) => {
    delete entry.materials;
    return entry;
  });
  writeDataSync(fileNameCsv, csvEntries);
}

/**
 * Update top-level inventory entry while utilizing existing inventory
 * /ARCHIVE_BASE/inventory.json
 *
 * @param {*} destination - Location of archive
 * @param {*} inventoryEntries - New entries to update or add in format { "id": { ... }, "id2": { ... } }
 */
function archiveInventoryMerge(destination, inventoryEntries) {
  const fileName = pathJoin(destination, "inventory.json");
  const fileNameCsv = pathJoin(destination, "inventory.csv");
  const currentInventory = existsSync(fileName) ? readDataSync(fileName) : {};
  const updateEntries = { ...currentInventory, ...inventoryEntries };
  makeDirectoriesSync(fileName);
  writeDataSync(fileName, updateEntries);

  // For CSV, remove material entries
  const csvEntries = Object.values(updateEntries).map((entry) => {
    delete entry.materials;
    return entry;
  });
  writeDataSync(fileNameCsv, csvEntries);
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

export {
  getArchiveInventory,
  copyBackupArchive,
  archiveInventoryUpdate,
  archiveInventoryMerge,
  dateInventoryUpdate,
};
