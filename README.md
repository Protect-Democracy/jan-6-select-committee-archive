# Jan 6 Select Committee archive

Utility to archive the Jan 6 Select Committee materials released in December of 2022.

## Install and setup

1. Get code: `git clone .... && cd jan6-select-committee-archive`
1. Install [Node.js](https://nodejs.org/en/download/).
1. Install dependencies: `npm install`

## Usage

```bash
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
```

## Archive structure

- `inventory.json` - JSON file with a list of all the files in the archive.
- `inventory.csv` - CSV version.
- `DATE/inventory.json` - JSON file with a list of all the files for that date.
- `DATE/inventory.csv` - CSV version.
- `DATE/PAGE_ID-screenshot.png` - Screenshot of page.
- `DATE/PAGE_ID/*` - Materials downloaded.
- `DATE/DATE.zip` - Zip of everything of date.

## Backup

### S3

To backup files to S3, do something like the following:

```bash
aws s3 sync output/ s3://my-bucket/jan6-select-committee-archive/
```
