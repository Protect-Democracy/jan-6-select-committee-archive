# Jan 6 Select Committee archive

Some simple scripts to archive the Jan 6 Select Committee materials released in December of 2022.

## Install and setup

1. Get code: `git clone .... && cd jan6-select-committee-archive`
1. Install [Node.js](https://nodejs.org/en/download/).
1. Install dependencies: `npm install`

## Usage

Archive all files. This will parse the relevant web page(s) and compiled a list of files to download, then download them.

```bash
node index.js
```

This will output to the `output/DATE/` directory the following:

- `document-urls.csv` - A CSV with the basic documents identified with their URLs.
- `document-urls.json` - A JSON file with the same data as the CSV.
- `documents.csv` - A CSV with the same data as `document-urls.csv` but with extra fields that describe what files have been downloaded locally.
- `documents.json` - A JSON file with the same data as the CSV.
- `documents/*` - A directory with the downloaded files.

## Backup

### S3

To backup files to S3, do something like the following:

```bash
aws s3 sync output/ s3://my-bucket/jan6-select-committee-archive/
```
