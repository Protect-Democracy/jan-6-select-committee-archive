/**
 * Constants and configs
 */

// Dependencies
import { config as dotenvConfig } from "dotenv";
import { join as pathJoin, dirname } from "path";
import { fileURLToPath } from "url";
import { readDataSync } from "indian-ocean";

// Load environment variables
dotenvConfig();

// Local
const __dirname = dirname(fileURLToPath(import.meta.url));

// Constants
export const archiveUrlBase = (
  process.env.ARCHIVE_URL_BASE || "ARCHIVE_URL_BASE"
).replace(/\/$/, "");

export const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36";

const pagesPath = pathJoin(
  __dirname,
  "..",
  "data",
  "select-committee-pages.csv"
);
export const pages = readDataSync(pagesPath);
