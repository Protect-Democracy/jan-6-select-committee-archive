#!/usr/bin/env node

/**
 * Archive cli
 */

// Dependencies
import { join as pathJoin } from "path";
import { readDataSync } from "indian-ocean";
import meow from "meow";
import { pages } from "../lib/config.js";
import archive from "../lib/archive.js";
import archiveSite from "../lib/archive-site.js";
import parsers from "../lib/parsers/index.js";

// Setup CLI
const cli = meow(
  `
  Usage
    $ jan-6-archive <command>

  Commands
    archive          Archive a date.
    archive-site     Archive whole site.
    parse            Parse specific page.

  Options
    --output, -O     Path to output to; defaults to "output".
    --date, -d       Specific date in YYYY-MM-DD format; defaults to today.
    --id, -i         Specific page id.
    --overwrite, -o  Overwrite existing files.

  Examples
    $ jan-6-archive archive
    $ jan-6-archive parse --id press-release-2022-12-21
`,
  {
    importMeta: import.meta,
    flags: {
      output: {
        type: "string",
        alias: "O",
        default: "output",
      },
      date: {
        type: "string",
        alias: "d",
        default: new Date().toISOString().split("T")[0],
      },
      id: {
        type: "string",
        alias: "i",
      },
      overwrite: {
        type: "boolean",
        alias: "o",
      },
    },
  }
);

// Run archive
if (cli.input[0] === "archive") {
  archive(cli.flags.output, cli.flags.date, cli.flags.overwrite);
}

// Run whole site archive
if (cli.input[0] === "archive-site") {
  archiveSite(
    "https://january6th.house.gov/",
    pathJoin(
      cli.flags.output,
      cli.flags.date,
      `${cli.flags.date}-january6th.house.gov.zip`
    ),
    cli.flags.overwrite
  );
}

// Run parse
if (cli.input[0] === "parse") {
  // Get pages entry
  const page = pages.find((page) => page.id === cli.flags.id);

  if (!page) {
    throw new Error(`Unable to find page id "${cli.flags.id}".`);
  }

  if (!parsers[page.id]) {
    throw new Error(`Unable to find parser for page id "${page.id}".`);
  }

  const materials = await parsers[page.id](page);
  console.log(materials);
  console.log();
  console.log(`Done.  Found ${materials.length} materials.`);
}
