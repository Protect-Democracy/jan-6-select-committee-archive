#!/usr/bin/env node

/**
 * Archive cli
 */

// Dependencies
import meow from "meow";
import archive from "../lib/archive.js";

// Setup CLI
const cli = meow(
  `
  Usage
    $ jan-6-archive <command>

  Commands
    archive          Archive a date.
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

// Run parse
if (cli.input[0] === "parse") {
  console.log("TO IMPLEMENT");
}
