// Dependencies
import { dirname, join as pathJoin } from "path";
import { spawn } from "child_process";
import { parse as urlParse } from "url";
import { existsSync } from "indian-ocean";
import rimraf from "rimraf";
import zip from "./zip.js";
import { outputDone } from "./output.js";
import { secondsBetweenCalls, userAgent } from "./config.js";

/**
 * Run a wget mirror to get site, then zip it up.
 *
 * See: https://gist.github.com/mullnerz/9fff80593d6b442d5c1b
 *
 * @param {*} url - The URL to start archive from.
 * @param {*} output - The output directory to save the archive to.
 * @param {*} date - The date to use for the archive directory.
 */
async function archiveSite(url, destination, overwrite) {
  if (overwrite || !existsSync(destination)) {
    return new Promise((resolve, reject) => {
      const hostname = urlParse(url).hostname;
      const tempDestination = pathJoin(
        dirname(destination),
        `site-archive-${hostname}`
      );
      const wget = spawn(
        "wget",
        [
          "--mirror",
          "--continue",
          "--page-requisites",
          "--convert-links",
          "--html-extension",
          `--user-agent="${userAgent}"`,
          "-e",
          "robots=off",
          "--wait",
          `${secondsBetweenCalls}`,
          "-P",
          tempDestination,
          url,
        ],
        {
          stdio: "inherit",
        }
      );

      wget.on("error", (error) => {
        reject(error);
      });

      wget.on("close", (code) => {
        // Think wget has different codes
        // if (code !== 0) {
        //   return reject(new Error(`wget exited with code ${code}`));
        // }

        // Zip up the site
        zip({ directory: tempDestination }, destination, overwrite).then(() => {
          // Remove original directory
          rimraf.sync(tempDestination);

          // Mark
          outputDone();

          // All done
          resolve();
        });
      });
    });
  }
}

export default archiveSite;
