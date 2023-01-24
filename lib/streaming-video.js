/**
 * Wrapper around download streaming video.
 */

// Dependencies
import { dirname, join as pathJoin } from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { existsSync } from "indian-ocean";
import debug from "debug";
import { userAgentBrowserGenerate, commonHeaders } from "./config.js";

// Debug logger
const debugLog = debug("j6:streaming-video");

// Local
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Wrapper around download streaming video.
 *
 * @param {*} url
 * @param {*} destination
 * @param {*} overwrite
 */
async function streamingVideo(url, destination, overwrite) {
  if (overwrite || !existsSync(destination)) {
    // Make command
    const bin = pathJoin(
      __dirname,
      "..",
      "node_modules",
      "youtube-dl-exec",
      "bin",
      "yt-dlp"
    );
    const format = "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4";
    const headers = Object.entries(commonHeaders)
      .map(([k, v]) => `--add-header "${k}:${v.replace(/"/g, '\\"')}"`)
      .join(" ");

    const command = `${bin} --add-header "user-agent:${userAgentBrowserGenerate()}" ${headers} --output "${destination}" -f "${format}" "${url}"`;
    debugLog(command);

    // Run command
    execSync(command, {
      stdio: debugLog.enabled ? "inherit" : "ignore",
    });
  }
}

export default streamingVideo;
