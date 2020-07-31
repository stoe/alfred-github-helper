'use strict'

const path = require('path')
const alfy = require('alfy')

const pkg = require('../package.json')
const {homedir} = require('os')
const workflows = require(path.resolve(homedir(), '.alfred-github-helper-bookmarks.json'))

;(async () => {
  const {config} = alfy
  const token = config.get('token') || false

  if (token && typeof token === 'string' && token.length > 0) {
    const items = []
    const substring = alfy.input
    const regex = new RegExp(substring, 'i')

    for (const workflow of workflows) {
      const {uid, cmds, title, repo, url} = workflow

      if (regex.test(cmds) || regex.test(uid)) {
        items.push({
          title,
          subtitle: cmds.join(', '),
          arg: url ? url : repo,
          type: 'default',
          autocomplete: uid,
          icon: {
            type: 'png',
            path: path.resolve(__dirname, '../assets/bookmark.png')
          }
        })
      }
    }

    items.push({
      title: 'Search on github.com',
      subtitle: substring,
      arg: `search ${encodeURI(alfy.input)}`,
      type: 'default',
      autocomplete: 'search',
      icon: {
        type: 'png',
        path: path.resolve(__dirname, '../assets/search.png')
      }
    })

    return alfy.output(items)
  } else {
    const subtitle = `https://github.com/settings/tokens/new?description=${pkg.name}&scopes=${pkg.scope.join(',')}`

    return alfy.output([
      {
        title: 'GitHub token not found',
        subtitle: 'Please create and add your GitHub token (⌘ + ENTER to open GitHub)',
        arg: `token ${alfy.input}`,
        icon: {
          type: 'png',
          path: path.resolve(__dirname, '../assets/token.png')
        },
        mods: {
          cmd: {
            valid: true,
            arg: `gettoken ${subtitle}`,
            subtitle
          }
        }
      }
    ])
  }
})()
