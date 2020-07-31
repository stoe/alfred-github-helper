# `@stoe/alfred-github-helper`

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![Test](https://github.com/stoe/alfred-github-helper/workflows/ci/badge.svg)](https://github.com/stoe/alfred-github-helper/actions?query=workflow%3Aci) [![CodeQL](https://github.com/stoe/alfred-github-helper/workflows/codeql/badge.svg)](https://github.com/stoe/alfred-github-helper/actions?query=workflow%3Acodeql) [![Publish](https://github.com/stoe/alfred-github-helper/workflows/publish/badge.svg)](https://github.com/stoe/alfred-github-helper/actions?query=workflow%3Apublish)

> Alfred GitHub Helper

## Installation

```sh
$ npm install -g @stoe/alfred-github-helper@1.0.0
```

You might need to [configuring npm for use with GitHub Packages](https://docs.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages) first:

```sh
$ npm config set @stoe:registry https://npm.pkg.github.com/
$ npm login --registry=https://npm.pkg.github.com/ --scope=@stoe
```

See also https://docs.npmjs.com/misc/scope#associating-a-scope-with-a-registry

## Usage

### Preparation

![no GitHub token](.github/assets/no-token.png)
![no org nor team](.github/assets/no-org-team.png)

### Bookmarks

![bookmarks example](.github/assets/bookmarks.png)

In your homefolder create a file called `.alfred-github-helper-bookmarks.json` and add your bookmarks following the below example:

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

## License

- [MIT](./license) © [Stefan Stölzle](https://github.com/stoe)
- [Code of Conduct](./.github/code_of_conduct.md)
