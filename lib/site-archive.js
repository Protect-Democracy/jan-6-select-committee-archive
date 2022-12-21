// Dependencies
import { join } from "path";
import { spawn } from "child_process";

/**
 * Just a wrapper to run the wget command.
 *
 * See: https://gist.github.com/mullnerz/9fff80593d6b442d5c1b
 *
 * @param {*} url - The URL to start archive from.
 * @param {*} output - The output directory to save the archive to.
 * @param {*} date - The date to use for the archive directory.
 */
function archiveSite(url, output, date) {
  // Example: wget -mpck --html-extension --user-agent="" -e robots=off --wait 1 -P test/site-archive/ https://judiciary.house.gov/the-impeachment-of-donald-john-trump/

  // TODO: Can't seem to find a way to mirror just a page and its assets, but not the
  // entire site. The following does the whole site, but --no-parent won't get files
  // tha are in a parent directory even though they are direct links on the page.

  const destination = join(output, date, "site-archive");
  const wget = spawn(
    "wget",
    [
      "--mirror",
      // "--no-parent",
      "--continue",
      "--page-requisites",
      "--convert-links",
      "--html-extension",
      '--user-agent=""',
      "-e",
      "robots=off",
      "--wait",
      "1",
      "-P",
      destination,
      url,
    ],
    {
      stdio: "inherit",
    }
  );
}

export default archiveSite;
