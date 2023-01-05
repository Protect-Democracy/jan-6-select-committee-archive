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

export const userAgentGenerate = () => {
  return `Mozilla/5.0 (compatible; Googlebot/2.${Math.floor(
    Math.random() * 10
  )}; +http://www.google.com/bot.html)`;
};

export const userAgentBrowser =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36";

export const userAgentBrowserGenerate = () => {
  return `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_${Math.floor(
    Math.random() * 10
  )}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/10${Math.floor(
    Math.random() * 10
  )}.0.0.${Math.floor(Math.random() * 10)} Safari/537.36`;
};

export const commonHeaders = {
  "cache-control": "max-age=0",
  "sec-ch-ua": '"Not?A_Brand";v="8", "Chromium";v="108"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
};

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

export const secondsBetweenCalls = 0.1;

export const cacheDirectory = pathJoin(__dirname, "..", ".cache");
