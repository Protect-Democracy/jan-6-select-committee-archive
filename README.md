# Jan 6 Select Committee archive

## Archive

The following provides links and descriptions to the materials that have been archived so far. At the end of 2022, the Select Committee on the January 6th Attack on the United States Capitol released a series of documents and materials. This archive is an attempt to collect and archive these materials. Initially, this archive meant to take a snapshot of materials each day, but has changed to an ongoing, singular set of materials.

Top-level inventory: [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/inventory.csv)

| Set        | Inventories                                                                                                                                                                                                  | Materials                                                                                                                       | Notes                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2022-12-23 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-23/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-23/inventory.csv) | 37 materials, [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-23/2022-12-23.zip) (101.4 MB)  |                                                                                                                                                                                                  |
| 2022-12-26 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-26/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-26/inventory.csv) | 104 materials, [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-26/2022-12-26.zip) (346.8 MB) |                                                                                                                                                                                                  |
| 2022-12-28 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-28/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-28/inventory.csv) | 122 materials, [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-28/2022-12-28.zip) (490.8 MB) |                                                                                                                                                                                                  |
| 2022-12-29 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-29/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-29/inventory.csv) | 141 materials, [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-29/2022-12-29.zip) (584.5 MB) |                                                                                                                                                                                                  |
| 2022-12-30 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-30/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-30/inventory.csv) | 184 materials, [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-30/2022-12-30.zip) (792.6 MB) |                                                                                                                                                                                                  |
| 2022-12-31 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-31/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-31/inventory.csv) | 184 materials, [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2022-12-31/2022-12-31.zip) (792.6 MB) |                                                                                                                                                                                                  |
| 2023-01-01 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-01/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-01/inventory.csv) | 184 materials, [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-01/2023-01-01.zip) (792.6 MB) |                                                                                                                                                                                                  |
| 2023-01-02 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-02/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-02/inventory.csv) | 292 materials, [ZIP](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-02/2023-01-02.zip) (1.1 GB)   |                                                                                                                                                                                                  |
| 2023-01-03 | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-03/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/2023-01-03/inventory.csv) | 859 materials                                                                                                                   | Includes [GPO materials](https://www.govinfo.gov/collection/january-6th-committee-final-report?path=/GPO/January%206th%20Committee%20Final%20Report%20and%20Supporting%20Materials%20Collection) |
| latest     | [JSON](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/latest/inventory.json), [CSV](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/latest/inventory.csv)         | ??                                                                                                                              | Ongoing set of materials; see [data/sources.csv](https://github.com/Protect-Democracy/jan-6-select-committee-archive/blob/main/data/sources.csv) for list of sources. **NOT UPLOADED YET**       |

### File structure

Depending on the version/set of the archive, it should follow something like this:

- `inventory.json` - JSON file with a list of all the different sets/dates of archives, and includes list of materials.
- `inventory.csv` - CSV version of JSON file; does not include list of materials.
- `SET/inventory.json` - JSON file with a list of all the materials for that set.
- `SET/inventory.csv` - CSV version of the JSON file.
- `SET/SOURCE/*` - Materials downloaded.
- `SET/SET.zip` - Zip of everything in that set.

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
    archive          Run archive and assign to a set.
    parse            Parse a specific source and output found materials that would be preserved.
    migrate          Run one-off migration.

  Options
    --output, -O     Path to output to; defaults to "output".
    --set, -s        Set to label this archive, defaults to "latest".
    --id, -i         Specific source for archive or migration id.
    --overwrite, -o  Overwrite existing files.

  Examples
    $ jan-6-archive archive
    $ jan-6-archive archive -O jan-6-archive -d 2020-01-01
    $ jan-6-archive archive --id specific-source
    $ jan-6-archive parse --id press-release-2022-12-21
    $ jan-6-archive migrate --id 20200101
```

#### Archive command

Archive command parses sources and downloads all materials found and saves them locally, grouped by in the assigned `set`.

- Given that this has moved to an ongoing archive, the default `--set` parameter is `latest` and should likely not be changed.
- **IMPORTANT TODO**: Currently this utility does not get the current archive from where it is hosted, so if you are starting from scratch, make sure to download the [current archive](https://select-committee-on-jan-6-archive.s3.us-west-2.amazonaws.com/inventory.json) and put it in the `--output` directory.
- Creates a backup of the current local inventory in `.cache/inventories/`.

#### Parse command

Use this to run a specific parser and see what materials would be downloaded. This is useful for debugging and testing. Parsers are found in `lib/parsers/`.

#### Migrate command

Use this to run a one-off migration. This is useful to restructure the archive or inventory. Migrations are found in `lib/migrations/`.

### Configure

The following environment variables can be set to help configure:

- `DEBUG` - Utilize something like `DEBUG=j6*` to see debug logs for this project only.
- `ARCHIVE_URL_BASE` - The base URL to where the archive will be hosted; should be something like `https://example.com`.

### Sources

The sources are defined in `data/sources.csv`.

### Sync with S3

To backup files to S3, do something like the following:

```bash
aws s3 sync output/ s3://my-bucket/jan6-select-committee-archive/ --exclude "*.DS_Store*"
```

### Suggested workflow

1. Set up environment variables.
1. Get copy of hosted `inventory.json` and put in `output/` (or wherever you set `--output` to).
1. Archive specific materials: `./bin/jan-6-archive archive`
1. Look over archived files.
1. See what will happen: `aws s3 sync output/ s3://select-committee-on-jan-6-archive/ --exclude "*.DS_Store*" --dryrun`
1. Upload to S3: `aws s3 sync output/ s3://select-committee-on-jan-6-archive/ --exclude "*.DS_Store*"`
