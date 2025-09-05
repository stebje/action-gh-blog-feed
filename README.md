# Get GitHub Blog entries

## Introduction

A GitHub Action that lists [GitHub Blog](https://github.blog/) entries that match a set of labels. The [GitHub Changelog](https://github.blog/changelog/) is also included.

## Inputs

- `token` - A token with `repo` scope
  - If using `${{ secrets.GITHUB_TOKEN }}`, ensure that the token has both read and write permissions in the repo where the workflow is running
  - To double-check your setting, go to `https://github.com/OWNER/REPO/settings/actions`
- `dry-run` - If `true`, the RSS feed will only be reported in the console log. If `false`, an issue will be created to list all RSS feed entries found.
- `labels` - A multi-line list of labels to search for. E.g. including `actions` will trigger the following search; `https://github.blog/feed/?s=actions`
- `days` - The number of days worth of posts to include in the list

## Outputs

- N/A

## Usage

### Example workflow

```yml
name: Get GitHub blog entries

on:
  workflow_dispatch:

jobs:
  get-blog-rss:
    name: Get GitHub blog RSS
    runs-on: ubuntu-latest
    steps:
      - name: Get GitHub Blog RSS
        id: get-github-blog-rss
        uses: stebje/action-gh-blog-feed@v0.1.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          dry-run: false
          labels: |
            'actions'
            'copilot'
```
