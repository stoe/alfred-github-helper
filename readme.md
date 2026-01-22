# `@stoe/alfred-github-helper`

[![test](https://github.com/stoe/alfred-github-helper/actions/workflows/test.yml/badge.svg)](https://github.com/stoe/alfred-github-helper/actions/workflows/test.yml) [![codeql](https://github.com/stoe/alfred-github-helper/actions/workflows/codeql.yml/badge.svg)](https://github.com/stoe/alfred-github-helper/actions/workflows/codeql.yml) [![publish](https://github.com/stoe/alfred-github-helper/actions/workflows/publish.yml/badge.svg)](https://github.com/stoe/alfred-github-helper/actions/workflows/publish.yml) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Alfred GitHub Helper

## Requirements

- Node 20 or later
- npm 10 or later

## Installation

```sh
$ npm install -g @stoe/alfred-github-helper@1.5.0
```

## Usage

### Preparation

1. In Alfred, type `g token <YOUR_PERSONAL_ACCESS_TOKEN>` to store a GitHub personal access token with the scopes `read:user`, `read:org`, and `user:email`.
2. Still in Alfred, type `g orgteam <org>/<team>` to set the organisation and team slug used for lookups.
3. Use the keyword `g` for bookmarks and search, and `@` to browse teams and members. A hotkey is included in the workflow; adjust it in Alfred if you prefer a different binding.

![no GitHub token](.github/assets/no-token.png)
![no org nor team](.github/assets/no-org-team.png)

### Bookmarks

![bookmarks example](.github/assets/bookmarks.png)

Store bookmarks in `~/.alfred-github-helper-bookmarks.json` using the following shape. If the file is missing, the workflow loads a default entry that links back to this repository.

```json
[
  {
    "uid": "alfred-github-helper",
    "title": "alfred-github-helper",
    "cmds": ["alfred-github-helper"],
    "url": "https://github.com/stoe/alfred-github-helper"
  }
]
```

### Teams and members

![teams and members example](.github/assets/teams-members.png)
![member quicklook example](.github/assets/quicklook.png)

Results are cached for 24 hours. Hold Command on a result to open the related GitHub URL.

### Troubleshooting

- **"GitHub token not found"**: set a personal access token with `g token <token>`.
- **"Couldn't find your organisation or team"**: set both values with `g orgteam <org>/<team>`.

## License

- [MIT](./license) © [Stefan Stölzle](https://github.com/stoe)
- [Code of Conduct](./.github/code_of_conduct.md)
