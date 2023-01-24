# Jan 6 Select Committee archive

## Archive

The following provides links and descriptions to the materials that have been archived so far. At the end of 2022, the Select Committee on the January 6th Attack on the United States Capitol released a series of documents and materials. This archive is an attempt to collect and archive these materials. Initially, this archive meant to take a snapshot of materials each day, but has changed to an ongoing, singular set of materials.

Top-level inventories: [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/inventory.csv)

| Date       | Inventories                                                                                                                                                                                                  | Materials                                                                                             | Notes                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2022-12-23 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-23/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-23/inventory.csv) | [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-23/2022-12-23.zip) |                                                                                                                                                                                                  |
| 2022-12-26 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-26/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-26/inventory.csv) | [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-26/2022-12-26.zip) |                                                                                                                                                                                                  |
| 2022-12-28 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-28/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-28/inventory.csv) | [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-28/2022-12-28.zip) |                                                                                                                                                                                                  |
| 2022-12-30 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-30/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-30/inventory.csv) | [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-30/2022-12-30.zip) |                                                                                                                                                                                                  |
| 2022-12-31 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-31/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-31/inventory.csv) | [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-31/2022-12-31.zip) |                                                                                                                                                                                                  |
| 2023-01-01 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-01/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-01/inventory.csv) | [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-01/2023-01-01.zip) |                                                                                                                                                                                                  |
| 2023-01-02 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-02/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-02/inventory.csv) | [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-02/2023-01-02.zip) |                                                                                                                                                                                                  |
| 2023-01-03 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-03/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-03/inventory.csv) |                                                                                                       | Includes [GPO materials](https://www.govinfo.gov/collection/january-6th-committee-final-report?path=/GPO/January%206th%20Committee%20Final%20Report%20and%20Supporting%20Materials%20Collection) |

### File structure

Depending on the version/date of the archive, it should follow something like this:

- `inventory.json` - JSON file with a list of all the different sets/dates of archives, and includes list of materials.
- `inventory.csv` - CSV version of JSON file; does not include list of materials.
- `DATE/inventory.json` - JSON file with a list of all the materials for that date.
- `DATE/inventory.csv` - CSV version of the JSON file.
- `DATE/SOURCE/*` - Materials downloaded.
- `DATE/DATE.zip` - Zip of everything of date.

## Collecting materials

This codebase provides a set of utilities to archive the **Jan 6 Select Committee** materials released in December of 2022 and any ongoing materials.

### Install and setup

1. Get code: `git clone https://github.com/Protect-Democracy/jan-6-select-committee-archive && cd jan6-select-committee-archive`
1. Install [Node.js](https://nodejs.org/en/download/).
1. Install dependencies: `npm install`

### Usage

Provides a CLI tool to run the archive process. Run `./bin/jan-6-archive` to see the following:

```txt
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
```

#### Archive

Archive command parses and downloads all materials from given pages and saves them locally, grouped by date.

## Configure

The following environment variables can be set to help configure:

- `ARCHIVE_URL_BASE` - The base URL to where the archive will be hosted; should be something like `https://example.com`.

## Sources and data

### Pages

Pages that are parsed are managed in `data/select-committee-pages.csv`. This describes URLs to attempt to parse and download materials from. Corresponding parsers are found in `lib/parsers/`.

The [final report](https://january6th.house.gov/sites/democrats.january6th.house.gov/files/Report_FinalReport_Jan6SelectCommittee.pdf) is considered a page to download materials from – most of which are external. Due to difficulty parsing the PDF on the fly, the PDF has been converted to HTML via Adobe Acrobat Pro and saved in `data/final-report/`. Even with this, many URLs are either not parsed or not parsed accurately.

### Direct materials

Some direct materials are managed in `data/select-committee-materials.csv`. These are materials that are not on a page, but are linked to directly. These are downloaded and saved in the archive under `direct-materials`.

## Backup

### S3

To backup files to S3, do something like the following:

```bash
aws s3 sync output/ s3://my-bucket/jan6-select-committee-archive/ --exclude "*.DS_Store*"
```

## Suggested workflow

1. Set up environment variables.
1. Archive specific materials: `./bin/jan-6-archive archive`
1. Archive whole site: `./bin/jan-6-archive archive-site`
1. Look over archived files.
1. See what will happen: `aws s3 sync output/ s3://select-committee-on-jan-6-archive/ --exclude "*.DS_Store*" --dryrun`
1. Upload to S3: `aws s3 sync output/ s3://select-committee-on-jan-6-archive/ --exclude "*.DS_Store*"`
