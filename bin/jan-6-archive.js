#!/usr/bin/env node

/**
 * Archive cli
 */

// Dependencies
import { join as pathJoin } from "path";
import meow from "meow";
import { sources } from "../lib/config.js";
import archive from "../lib/archive.js";
import parsers from "../lib/parsers/index.js";
import migrate from "../lib/migrate.js";
import { cliInput } from "../lib/utils.js";

// Setup CLI
const cli = meow(
  `
  Usage
    $ jan-6-archive <command>

  Commands
    archive          Archive a date.
    parse            Parse a specific source and output found materials.
    migrate          Migrate data.

  Options
    --output, -O     Path to output to; defaults to "output".
    --date, -d       Specific date in YYYY-MM-DD format; defaults to today.
    --id, -i         Specific source for archive or migration id.
    --overwrite, -o  Overwrite existing files.

  Examples
    $ jan-6-archive archive
    $ jan-6-archive archive -O jan-6-archive -d 2020-01-01
    $ jan-6-archive archive --id specific-source
    $ jan-6-archive parse --id press-release-2022-12-21
    $ jan-6-archive migrate --id 20200101
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
        default: "latest",
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
  const sure = await cliInput(
    `Are you sure you want to archive "${cli.flags.date}"; this may overwrite existing data? (y/n) `
  );
  if (!sure.match(/y(es)?/i)) {
    console.error("Exiting.");
    process.exit(0);
  }

  archive(cli.flags.output, cli.flags.date, cli.flags.overwrite, cli.flags.id);
}

// Run parse
if (cli.input[0] === "parse") {
  if (!cli.flags.id) {
    throw new Error(
      `Please provide source ID (--id) as date, ex. press-release-2020-01-01.`
    );
  }

  // Get sources entry
  const source = sources.find((source) => source.id === cli.flags.id);

  if (!source) {
    throw new Error(`Unable to find source id "${cli.flags.id}".`);
  }

  if (!parsers[source.id]) {
    throw new Error(`Unable to find parser for source id "${page.id}".`);
  }

  const materials = await parsers[source.id](source);
  console.log(JSON.stringify(materials, null, 2));
  console.log();
  console.log(`Done.  Found ${materials.length} materials.`);
}

// Migrate
if (cli.input[0] === "migrate") {
  if (!cli.flags.id) {
    throw new Error(
      `Please provide migration ID (--id) as date, ex. 20200101.`
    );
  }

  await migrate(cli.flags.id);
}
