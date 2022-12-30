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

// Google bot helps get around paywalls to take screenshots; this is not ideal.
// "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36";
// "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
export const userAgent =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

export const userAgentBrowser =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36";

const pagesPath = pathJoin(
  __dirname,
  "..",
  "data",
  "select-committee-pages.csv"
);
export const pages = readDataSync(pagesPath);

const materialsPath = pathJoin(
  __dirname,
  "..",
  "data",
  "select-committee-materials.csv"
);
export const materials = readDataSync(materialsPath);

export const secondsBetweenCalls = 0.2;
