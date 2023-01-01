/**
 * Download/preserve materials
 */

// Dependencies
import { basename, dirname, join as pathJoin } from "path";
import { parse as urlParse, fileURLToPath } from "url";
import Downloader from "nodejs-file-downloader";
import { execSync } from "child_process";
import {
  userAgent,
  userAgentBrowserGenerate,
  secondsBetweenCalls,
} from "./config.js";
import screenshot from "./screenshot.js";
import { sleep, urlToIdentifier } from "./utils.js";
import { outputError, outputWarning } from "./output.js";
import { existsSync } from "indian-ocean";

// Local
const __dirname = dirname(fileURLToPath(import.meta.url));

// Downloadable extensions
const downloadableExtensions = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "png",
  "jpeg",
  "jpg",
  "gif",
  "svg",
  "txt",
  "csv",
  "zip",
  "rar",
  "7z",
  "gz",
  "tar",
  "mp3",
  "mp4",
  "mov",
  "avi",
  "wmv",
  "flv",
  "webm",
  "m4v",
];
const fileNameUrlLimit = 100;

async function preserveMaterial(
  material,
  localMaterialDestination,
  hostedMaterialDestination,
  overwrite
) {
  if (!material.material_url) {
    throw new Error("Material URL not provided.");
  }

  if (!localMaterialDestination) {
    throw new Error("Local material destination not provided.");
  }

  if (!hostedMaterialDestination) {
    throw new Error("Hosted material destination not provided.");
  }

  // Possible parts to use
  const fileName = basename(material.material_url);
  const extension = fileName?.split(".")?.pop()?.toLowerCase();
  const hostName = urlParse(material.material_url).hostname;

  // Logging
  material.preserve_started = new Date().getTime();
  material.preserve_started_datetime = new Date().toISOString();

  // Documents
  if (
    downloadableExtensions.includes(extension) ||
    downloadableExtensions.includes(material.material_type)
  ) {
    // Handle manual file extensions with "material_type"
    const downloadFilename = material.material_type
      ? `download-${urlToIdentifier(material.material_url)}.${
          material.material_type
        }`
      : fileName;

    const downloader = new Downloader({
      url: material.material_url,
      directory: localMaterialDestination,
      fileName: downloadFilename,
      maxAttempts: 3,
      skipExistingFileName: overwrite ? false : true,
      headers: {
        "User-Agent": userAgentBrowserGenerate(),
      },
    });

    try {
      await downloader.download();

      material.preserve_action = "download";
      material.preserve_path = `${hostedMaterialDestination}/${downloadFilename}`;
    } catch (error) {
      // 404, mark
      if (error.statusCode === 404) {
        material.preserve_action = "skipped";
        material.preserve_note = "Unable to download material (404)";

        outputWarning(
          `Unable to download ${material.material_url} (404) - If this is the first time, please try again.`
        );
      } else {
        outputError(
          `Error downloading ${material.material_url}: ${error.message}`
        );
        throw error;
      }
    }
  } else if (hostName.match(/youtube|youtu\.be/i)) {
    // Download youtube video
    const videoFileName = pathJoin(
      localMaterialDestination,
      `video-${urlToIdentifier(material.material_url)}.mp4`
    );

    // Check if available
    if (!overwrite && existsSync(videoFileName)) {
      material.preserve_action = "download-youtube";
      material.preserve_path = `${hostedMaterialDestination}/${videoFileName}`;

      return;
    }

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
    const command = `${bin} --add-header "user-agent:${userAgent}" --output "${videoFileName}" -f "${format}" "${material.material_url}"`;

    // Run command

    try {
      execSync(command, { stdio: "inherit" });

      material.preserve_action = "download-youtube";
      material.preserve_path = `${hostedMaterialDestination}/${videoFileName}`;
    } catch (error) {
      material.preserve_action = "skipped";
      material.preserve_note = "Unable to download video material";

      outputWarning(
        `Unable to download material (youtube-dl): ${
          material.material_url
        } - ${error.toString()}`
      );
    }
  } else {
    // Take screenshot
    const screenshotFileName = `screenshot-${urlToIdentifier(
      material.material_url
    )}.png`;

    try {
      await screenshot(
        material.material_url,
        pathJoin(localMaterialDestination, screenshotFileName),
        overwrite
      );

      material.preserve_action = "screenshot";
      material.preserve_path = `${hostedMaterialDestination}/${screenshotFileName}`;
    } catch (error) {
      material.preserve_action = "skipped";
      material.preserve_note = "Unable to screenshot material";

      outputWarning(
        `Unable to screenshot ${material.material_url} - ${error.toString()}`
      );
    }
  }

  material.preserve_completed = new Date().getTime();
  material.preserve_completed_datetime = new Date().toISOString();

  await sleep(secondsBetweenCalls);

  return material;
}

export default preserveMaterial;
