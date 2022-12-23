/**
 * Constants and configs
 */

// Dependencies
import { config as dotenvConfig } from "dotenv";

// Load environment variables
dotenvConfig();

// Constants
export const archiveUrlBase = (
  process.env.ARCHIVE_URL_BASE || "ARCHIVE_URL_BASE"
).replace(/\/$/, "");

export const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36";
