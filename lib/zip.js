/**
 * Zip files up.
 */

// Dependencies
import { createWriteStream } from "fs";
import { existsSync } from "indian-ocean";
import archiver from "archiver";

async function zip(source, destination, overwrite, ignores = []) {
  if (!source) {
    throw new Error("Source not provided.");
  }

  if (!destination) {
    throw new Error("Destination not provided.");
  }

  if (overwrite || !existsSync(destination)) {
    return new Promise((resolve, reject) => {
      // Setup
      const destinationStream = createWriteStream(destination);
      const archive = archiver("zip");

      // On close
      destinationStream.on("close", () => {
        resolve();
      });

      // Error
      archive.on("error", (error) => {
        reject(error);
      });

      // Pipe
      archive.pipe(destinationStream);

      // Add files
      if (source && source.directory) {
        archive.directory(source.directory, false);
      } else if (source && source.glob) {
        archive.glob(source.glob, {
          cwd: source.globCwd,
          ignore: ["**/*.zip", "site-archive-*/**/*", ...ignores],
        });
      }

      // Finalize
      archive.finalize();
    });
  }
}

export default zip;
