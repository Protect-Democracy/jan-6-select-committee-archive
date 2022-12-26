/**
 * Download/preserve materials
 */

// Dependencies
import { basename } from "path";
import { parse as urlParse } from "url";
import Downloader from "nodejs-file-downloader";
import youtubeDl from "youtube-dl-exec";
import { userAgent, secondsBetweenCalls } from "./config.js";
import screenshot from "./screenshot.js";
import { sleep } from "./utils.js";
import { outputError, outputWarning } from "./output.js";

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
  if (downloadableExtensions.includes(extension)) {
    const downloader = new Downloader({
      url: material.material_url,
      directory: localMaterialDestination,
      fileName: fileName,
      maxAttempts: 3,
      skipExistingFileName: overwrite ? false : true,
    });

    try {
      await downloader.download();

      material.preserve_action = "download";
      material.preserve_path = `${hostedMaterialDestination}/${fileName}`;
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
  } else if (hostName.match(/youtube/i)) {
    // Download youtube video
    const videoFileName = `video-${encodeURIComponent(
      material.material_url
    ).substring(0, fileNameUrlLimit)}.mp4`;

    await youtubeDl(link.url, {
      o: join(localMaterialDestination, videoFileName),
      addHeader: [`user-agent: ${userAgent}`],
    });

    material.preserve_action = "download-youtube";
    material.preserve_path = `${hostedMaterialDestination}/${videoFileName}`;
  } else {
    // Take screenshot
    const screenshotFileName = `screenshot-${encodeURIComponent(
      material.material_url
    ).substring(0, fileNameUrlLimit)}.png`;

    await screenshot(
      material.material_url,
      join(localMaterialDestination, screenshotFileName),
      overwrite
    );

    material.preserve_action = "screenshot";
    material.preserve_path = `${hostedMaterialDestination}/${screenshotFileName}`;
  }

  material.preserve_completed = new Date().getTime();
  material.preserve_completed_datetime = new Date().toISOString();

  await sleep(secondsBetweenCalls);

  return material;
}

export default preserveMaterial;
