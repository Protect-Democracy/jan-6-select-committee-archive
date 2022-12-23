# Jan 6 Select Committee archive

Utility to archive the [Jan 6 Select Committee](https://january6th.house.gov/) materials released in December of 2022.

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
```

### Archive

Archive command parses and downloads all materials from given pages and saves them locally, grouped by date.

#### Archive structure

- `inventory.json` - JSON file with a list of all the files in the archive.
- `inventory.csv` - CSV version.
- `DATE/inventory.json` - JSON file with a list of all the files for that date.
- `DATE/inventory.csv` - CSV version.
- `DATE/PAGE_ID-screenshot.png` - Screenshot of page.
- `DATE/PAGE_ID/*` - Materials downloaded.
- `DATE/DATE.zip` - Zip of everything of date.
- `DATE/DATE-january6th.house.gov.zip` - Zip of entire site.

## Configure

The following environment variables can be set to help configure:

- `ARCHIVE_URL_BASE` - The base URL to where the archive will be hosted; should be something like https://example.com.

## Backup

### S3

To backup files to S3, do something like the following:

```bash
aws s3 sync output/ s3://my-bucket/jan6-select-committee-archive/
```

## Suggested workflow

1. Set up environment variables.
1. Archive specific materials: `./bin/jan-6-archive archive`
1. Archive whole site: `./bin/jan-6-archive archive-site`
1. Look over archived files.
1. Upload to S3: `aws s3 sync output/ s3://my-bucket/jan6-select-committee-archive/`
