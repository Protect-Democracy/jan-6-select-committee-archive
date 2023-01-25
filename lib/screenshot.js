/**
 * Wrapper around screenshot.
 */

// Dependencies
import { existsSync } from "indian-ocean";
import captureWebsite from "capture-website";
import { userAgentBrowserGenerate, commonHeaders } from "./config.js";

/**
 * Wrapper around taking screenshots.
 *
 * @param {*} url
 * @param {*} destination
 * @param {*} overwrite
 */
async function screenshot(url, destination, overwrite) {
  if (overwrite || !existsSync(destination)) {
    await captureWebsite.file(url, destination, {
      width: 1920,
      height: 1080,
      fullPage: true,
      overwrite: true,
      userAgent: userAgentBrowserGenerate(),
      headers: commonHeaders,
    });
  }
}

export default screenshot;
