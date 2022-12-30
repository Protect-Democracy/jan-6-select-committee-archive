// Dependencies
import { test } from "tape";
import { existsSync } from "fs";
import { basename, dirname, join as pathJoin } from "path";
import { parse as urlParse, fileURLToPath } from "url";
import preserveMaterial from "../lib/preserve-materials.js";

// Local
const __dirname = dirname(fileURLToPath(import.meta.url));

// Youtube download
test("test preserveMaterial youtube download", async (t) => {
  const material = {
    material_url: "https://youtu.be/-AAyKAoPFQs?t=133",
  };
  const localMaterialDestination = pathJoin(__dirname, "test-output");
  const hostedMaterialDestination = "TEST";
  const overwrite = true;
  const result = await preserveMaterial(
    material,
    localMaterialDestination,
    hostedMaterialDestination,
    overwrite
  );

  t.equal(
    existsSync(
      pathJoin(__dirname, "test-output", "video-youtu-be--aaykaopfqs-t-133.mp4")
    ),
    true,
    "Youtube download exists"
  );
});

// Screenshot
test("test preserveMaterial screenshot", async (t) => {
  const material = {
    material_url: "https://protectdemocracy.org",
  };
  const localMaterialDestination = pathJoin(__dirname, "test-output");
  const hostedMaterialDestination = "TEST";
  const overwrite = true;
  const result = await preserveMaterial(
    material,
    localMaterialDestination,
    hostedMaterialDestination,
    overwrite
  );

  t.equal(
    existsSync(
      pathJoin(__dirname, "test-output", "screenshot-protectdemocracy-org.png")
    ),
    true,
    "Screenshot exists"
  );
});

// Download without extenstion
test("test preserveMaterial download without extenstion", async (t) => {
  const material = {
    material_url: "https://www.justice.gov/opa/page/file/1354806/download",
    material_type: "pdf",
  };
  const localMaterialDestination = pathJoin(__dirname, "test-output");
  const hostedMaterialDestination = "TEST";
  const overwrite = true;
  const result = await preserveMaterial(
    material,
    localMaterialDestination,
    hostedMaterialDestination,
    overwrite
  );

  t.equal(
    existsSync(
      pathJoin(
        __dirname,
        "test-output",
        "download-www-justice-gov-opa-page-file-1354806-download.pdf"
      )
    ),
    true,
    "Screenshot exists"
  );
});
