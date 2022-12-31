/**
 * Top level archive function
 */

// Dependencies
import {
  makeDirectoriesSync,
  writeDataSync,
  readDataSync,
  existsSync,
} from "indian-ocean";
import { join as pathJoin } from "path";
import { outputTopItem, outputDone } from "./output.js";
import archivePage from "./archive-page.js";

/**
 * Top level archive
 *
 * @param {*} destination
 * @param {*} date
 */
async function archiveFinalReport(destination, date, overwrite) {
  // Make sure we have our directories
  makeDirectoriesSync(destination, date);
  const inventoryPath = pathJoin(destination, "inventory.json");

  // Read inventory
  let materialsInventory;
  if (existsSync(inventoryPath)) {
    materialsInventory = readDataSync(pathJoin(destination, "inventory.json"));
  }

  // Get materials
  outputTopItem(`Archiving final-report...`);
  let materials = await archivePage(
    {
      id: "final-report",
      url: "https://january6th.house.gov/sites/democrats.january6th.house.gov/files/Introductory%20Material%20to%20the%20Final%20Report%20of%20the%20Select%20Committee2.pdf",
    },
    destination,
    date,
    overwrite
  );

  // Output initial list of inventory
  writeDataSync(pathJoin(destination, "inventory.json"), materials);

  outputDone();
}

export default archive;
