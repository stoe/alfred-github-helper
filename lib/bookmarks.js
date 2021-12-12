import {dirname, resolve} from 'path'
import {existsSync, readFileSync} from 'fs'
import alfy from 'alfy'
import {fileURLToPath} from 'url'
import {homedir} from 'os'
import {readPackageUp} from 'read-pkg-up'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// execute
;(async () => {
  const {packageJson: pkg} = await readPackageUp()
  const {config} = alfy
  const bookmarksFile = resolve(homedir(), '.alfred-github-helper-bookmarks.json')
  const token = config.get('token') || false

  if (token && typeof token === 'string' && token.length > 0) {
    const bookmarks = existsSync(bookmarksFile)
      ? readFileSync(bookmarksFile)
      : [
          {
            uid: 'alfred-github-helper',
            title: pkg.name,
            cmds: [`${bookmarksFile} not found. using default bookmarks`],
            url: 'https://github.com/stoe/alfred-github-helper'
          }
        ]
    const items = []
    const substring = alfy.input
    const regex = new RegExp(substring, 'i')

    for (const bookmark of bookmarks) {
      const {uid, cmds, title, repo, url} = bookmark

      if (regex.test(cmds) || regex.test(uid)) {
        items.push({
          title,
          subtitle: cmds.join(', '),
          arg: url ? url : repo,
          type: 'default',
          autocomplete: uid,
          icon: {
            type: 'png',
            path: resolve(__dirname, '../assets/bookmark.png')
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
        path: resolve(__dirname, '../assets/search.png')
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
          path: resolve(__dirname, '../assets/token.png')
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
