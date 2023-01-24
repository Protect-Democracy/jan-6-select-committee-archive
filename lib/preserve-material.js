/**
 * Download/preserve materials
 */

// Dependencies
import { basename, join as pathJoin } from "path";
import { parse as urlParse } from "url";
import { findKey } from "lodash-es";
import { existsSync } from "indian-ocean";
import Downloader from "nodejs-file-downloader";
import debug from "debug";
import { filesize } from "filesize";
import { statSync } from "fs";
import {
  userAgentBrowserGenerate,
  secondsBetweenCalls,
  commonHeaders,
  archiveUrlBase,
} from "./config.js";
import screenshot from "./screenshot.js";
import streamingVideo from "./streaming-video.js";
import archiveSite from "./archive-site.js";
import { sleep } from "./utils.js";
import { outputWarning } from "./output.js";

// Debug logger
const debugLog = debug("j6:preserve-material");

// Known extensions
const knownExtensions = {
  document: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
  audio: ["mp3"],
  video: ["mp4", "mov", "avi", "wmv", "flv", "webm", "m4v"],
  image: ["png", "jpeg", "jpg", "gif", "svg"],
};

/**
 * Wrapper to determine how to preserve a material.
 *
 * @param {*} material
 * @param {*} localMaterialDestination
 * @param {*} hostedMaterialDestination
 * @param {*} overwrite
 * @param {*} destination
 * @param {*} stopOnFail
 * @returns
 */
async function preserveMaterial(
  material,
  destination,
  date,
  overwrite,
  stopOnFail = false
) {
  if (!material.url) {
    throw new Error("Material URL not provided.");
  }

  if (!destination) {
    throw new Error("Destination not provided.");
  }

  if (!date) {
    throw new Error("Date not provided.");
  }

  // Destinations
  const localMaterialDestination = pathJoin(
    destination,
    date,
    material.source_id
  );
  const hostedMaterialDestination = `${archiveUrlBase}/${pathJoin(
    date,
    material.source_id
  )}`;

  // Possible parts to determine action
  const hostName = urlParse(material.url).hostname;

  // Determine preserve action
  if (
    material.type === "screenshot" ||
    material.preserve_action === "screenshot"
  ) {
    material = await preserveScreenshot(
      material,
      localMaterialDestination,
      hostedMaterialDestination,
      overwrite,
      stopOnFail
    );
  } else if (
    hostName.match(/youtube|youtu\.be/i) ||
    material.type === "download-streaming-video" ||
    material.preserve_action === "download-streaming-video"
  ) {
    material = await preserveStreamingVideo(
      material,
      localMaterialDestination,
      hostedMaterialDestination,
      overwrite,
      stopOnFail
    );
  } else if (
    material.type === "website-archive" ||
    material.preserve_action === "website-archive"
  ) {
    material = await preserveWebsiteArchive(
      material,
      localMaterialDestination,
      hostedMaterialDestination,
      overwrite,
      stopOnFail
    );
  } else {
    material = await preserveDownload(
      material,
      localMaterialDestination,
      hostedMaterialDestination,
      overwrite,
      stopOnFail
    );
  }

  // Update material with file size
  const materialFilePath = pathJoin(
    destination,
    date,
    material.preserve_path || ""
  );
  if (material.preserve_path && existsSync(materialFilePath)) {
    material.file_bytes = statSync(materialFilePath).size;
    material.file_size = filesize(material.file_bytes);
  } else {
    material.file_bytes = undefined;
    material.file_size = undefined;
  }

  return material;
}

/**
 * Preserve a screenshot.
 *
 * @param {*} material
 * @param {*} localMaterialDestination
 * @param {*} hostedMaterialDestination
 * @param {*} overwrite
 * @returns
 */
async function preserveScreenshot(
  material,
  localMaterialDestination,
  hostedMaterialDestination,
  overwrite,
  stopOnFail
) {
  const fileName = `${material.id}.png`;
  const localPath = pathJoin(localMaterialDestination, fileName);
  const hostedPath = `${hostedMaterialDestination}/${fileName}`;

  // Determine if we need to
  if (shouldPreserve(material, localPath, overwrite)) {
    debugLog(`Preserving screenshot: ${material.id}`);

    material.preserve_started = new Date().getTime();
    material.preserve_started_datetime = new Date().toISOString();

    try {
      // Actual screenshot
      await screenshot(material.url, localPath, true);

      material.type = material.type || "screenshot";
      material.preserve_action = "screenshot";
      material.last_preserve_action = "screenshot";
      material.preserve_completed = new Date().getTime();
      material.preserve_completed_datetime = new Date().toISOString();
      material.preserve_path = pathJoin(material.source_id, fileName);
      material.preserve_path_hosted = hostedPath;
    } catch (error) {
      material.preserve_action = "error";
      material.last_preserve_action = "error";
      material.preserve_note = "Error taking screenshot";

      outputWarning(
        `Unable to take screenshot: ${material.url} - ${error.toString()}`
      );
      debugLog(error.stack?.split("\n"));

      if (stopOnFail) {
        throw error;
      }
    }

    await sleep(secondsBetweenCalls);
  } else {
    material.last_preserve_action = "skipped";
  }

  return material;
}

/**
 * Preserve streaming video.
 *
 * @param {*} material
 * @param {*} localMaterialDestination
 * @param {*} hostedMaterialDestination
 * @param {*} overwrite
 * @returns
 */
async function preserveStreamingVideo(
  material,
  localMaterialDestination,
  hostedMaterialDestination,
  overwrite,
  stopOnFail
) {
  const fileName = `${material.id}.mp4`;
  const localPath = pathJoin(localMaterialDestination, fileName);
  const hostedPath = `${hostedMaterialDestination}/${fileName}`;

  // Determine if we need to
  if (shouldPreserve(material, localPath, overwrite)) {
    debugLog(`Preserving streaming video: ${material.id}`);

    material.preserve_started = new Date().getTime();
    material.preserve_started_datetime = new Date().toISOString();

    try {
      // Download
      await streamingVideo(material.url, localPath, overwrite);

      // Metadata
      material.type = material.type || "video";
      material.preserve_action = "download-streaming-video";
      material.last_preserve_action = "download-streaming-video";
      material.preserve_completed = new Date().getTime();
      material.preserve_completed_datetime = new Date().toISOString();
      material.preserve_path = pathJoin(material.source_id, fileName);
      material.preserve_path_hosted = hostedPath;
    } catch (error) {
      material.preserve_action = "error";
      material.last_preserve_action = "error";
      material.preserve_note = "Error download streaming video";

      outputWarning(
        `Unable to download streaming video: ${
          material.url
        } - ${error.toString()}`
      );
      debugLog(error.stack?.split("\n"));

      if (stopOnFail) {
        throw error;
      }
    }

    await sleep(secondsBetweenCalls);
  } else {
    material.last_preserve_action = "skipped";
  }

  return material;
}

/**
 * Preserve website archive.
 *
 * @param {*} material
 * @param {*} localMaterialDestination
 * @param {*} hostedMaterialDestination
 * @param {*} overwrite
 * @returns
 */
async function preserveWebsiteArchive(
  material,
  localMaterialDestination,
  hostedMaterialDestination,
  overwrite,
  stopOnFail
) {
  const fileName = `${material.id}.zip`;
  const localPath = pathJoin(localMaterialDestination, fileName);
  const hostedPath = `${hostedMaterialDestination}/${fileName}`;

  // Determine if we need to
  if (shouldPreserve(material, localPath, overwrite)) {
    debugLog(`Preserving website archive: ${material.id}`);

    material.preserve_started = new Date().getTime();
    material.preserve_started_datetime = new Date().toISOString();

    try {
      // Archive
      await archiveSite(material.url, localPath, overwrite);

      // Metadata
      material.type = material.type || "website-archive";
      material.preserve_action = "website-archive";
      material.last_preserve_action = "website-archive";
      material.preserve_completed = new Date().getTime();
      material.preserve_completed_datetime = new Date().toISOString();
      material.preserve_path = pathJoin(material.source_id, fileName);
      material.preserve_path_hosted = hostedPath;
    } catch (error) {
      material.preserve_action = "error";
      material.last_preserve_action = "error";
      material.preserve_note = "Error archiving website";

      outputWarning(
        `Unable to archive website: ${material.url} - ${error.toString()}`
      );
      debugLog(error.stack?.split("\n"));

      if (stopOnFail) {
        throw error;
      }
    }

    await sleep(secondsBetweenCalls);
  } else {
    material.last_preserve_action = "skipped";
  }

  return material;
}

/**
 * Download file
 *
 * @param {*} material
 * @param {*} localMaterialDestination
 * @param {*} hostedMaterialDestination
 * @param {*} overwrite
 * @returns
 */
async function preserveDownload(
  material,
  localMaterialDestination,
  hostedMaterialDestination,
  overwrite,
  stopOnFail
) {
  const urlFileName = basename(material.url);
  const extension = urlFileName?.split(".")?.pop()?.toLowerCase();
  const fileName = `${material.id}${extension ? "." : ""}${extension || ""}`;
  const localPath = pathJoin(localMaterialDestination, fileName);
  const hostedPath = `${hostedMaterialDestination}/${fileName}`;
  const downloadType = findKey(knownExtensions, (extensions) =>
    extensions.includes(extension)
  );

  // Determine if we need to
  if (shouldPreserve(material, localPath, overwrite)) {
    debugLog(`Preserving download: ${material.id}`);

    material.preserve_started = new Date().getTime();
    material.preserve_started_datetime = new Date().toISOString();

    try {
      // Download
      const downloader = new Downloader({
        url: material.url,
        directory: localMaterialDestination,
        fileName: fileName,
        maxAttempts: 3,
        skipExistingFileName: overwrite ? false : true,
        headers: {
          "user-agent": userAgentBrowserGenerate(),
          ...commonHeaders,
        },
      });
      await downloader.download();

      // Metadata
      material.type = material.type || downloadType || "unknown";
      material.preserve_action = "download";
      material.last_preserve_action = "download";
      material.preserve_completed = new Date().getTime();
      material.preserve_completed_datetime = new Date().toISOString();
      material.preserve_path = pathJoin(material.source_id, fileName);
      material.preserve_path_hosted = hostedPath;
    } catch (error) {
      // 404, mark as skipped
      if (error.statusCode === 404) {
        material.preserve_action = "skipped";
        material.last_preserve_action = "skipped-404";
        material.preserve_note = "Unable to download material (404)";
        material.preserve_completed = undefined;
        material.preserve_completed_datetime = undefined;

        outputWarning(
          `Unable to download ${material.url} (404) - If this is the first time, please try again.`
        );
        debugLog(error.stack?.split("\n"));
      } else {
        material.preserve_action = "error";
        material.last_preserve_action = "error";
        material.preserve_note = "Error downloading";

        outputWarning(
          `Unable to download: ${material.url} - ${error.toString()}`
        );

        if (stopOnFail) {
          throw error;
        }
      }
    }

    await sleep(secondsBetweenCalls);
  } else {
    material.last_preserve_action = "skipped";
  }

  return material;
}

/**
 * Determine if material should be preserved.
 *
 * @param {*} material
 * @param {*} localPath
 * @param {*} overwrite
 * @returns
 */
function shouldPreserve(material, localPath, overwrite) {
  // Preserve if:
  // - Overwrite is true
  // - Local file does not exist
  // - Preserve completed is not true
  // - Preserve action is not set
  // - Preserve action is set but is an error or skipped
  if (
    overwrite ||
    !existsSync(localPath) ||
    !material.preserve_completed ||
    !material.preserve_action ||
    material.preserve_action?.match(/(error|skipped)/i)
  ) {
    // debugLog(`
    //   id: ${material.id}
    //   overwrite: ${!!overwrite}
    //   localPath: ${!existsSync(localPath)}
    //   preserve_completed: ${!material.preserve_completed}
    //   preserve_action: ${!material.preserve_action}
    //   preserve_action_match: ${!!material.preserve_action?.match(
    //     /(error|skipped)/i
    //   )}
    // `);
    return true;
  }

  return false;
}

export default preserveMaterial;
