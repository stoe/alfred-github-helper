import {dirname, resolve} from 'path'
import {Octokit} from '@octokit/core'
import alfy from 'alfy'
import {fileURLToPath} from 'url'
import {readPackageUp} from 'read-pkg-up'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const teamQuery = `query ($org: String!, $team: String!){
  organization(login: $org) {
    team(slug: $team) {
      ...Team
    }
  }
}

fragment Team on Team {
  name
  organization { login }
  slug
  url
  childTeams(first: 50, orderBy: {field: NAME, direction: ASC}) {
    nodes {
      name
      organization { login }
      slug
      url
      childTeams(first: 50, orderBy: {field: NAME, direction: ASC}) {
        nodes {
          name
          organization { login }
          slug
          url
          childTeams(first: 50, orderBy: {field: NAME, direction: ASC}) {
            nodes {
              name
              organization { login }
              slug
              url
            }
          }
        }
      }
    }
  }
}`

const teamIcon = {
  type: 'png',
  path: resolve(__dirname, '../assets/team.png')
}

async function getTeams(team, data = []) {
  if (team.name) {
    const at = `@${team.organization.login}/${team.slug}`

    data.push({
      title: `${team.name}`,
      subtitle: `${at}`,
      arg: `team ${at}`,
      autocomplete: `${at}`,
      match: [team.slug, team.name].join(', '),
      icon: teamIcon,
      type: 'default',
      valid: true,
      mods: {
        cmd: {
          subtitle: `${team.url}`,
          arg: `url ${team.url}`
        }
      }
    })
  }

  if (team.childTeams && team.childTeams.nodes) {
    for (const t of team.childTeams.nodes) {
      await getTeams(t, data)
    }
  }

  return data
}

const sortTeams = (a, b) => {
  // Use toUpperCase() to ignore character casing
  const A = a.title.toUpperCase()
  const B = b.title.toUpperCase()

  let comparison = 0

  if (A > B) {
    comparison = 1
  } else if (A < B) {
    comparison = -1
  }

  return comparison
}

const membersQuery = `query ($org: String!, $team: String!, $page: String) {
  organization(login: $org) {
    login
    team(slug: $team) {
      slug
      members(first: 100, membership: ALL, orderBy: {field: LOGIN, direction: ASC}, after: $page) {
        nodes {
          login
          name
          avatarUrl
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
}`

const memberIcon = {
  type: 'png',
  path: resolve(__dirname, '../assets/member.png')
}

async function getMembers(octokit, org, team, data = []) {
  const {members} = team

  if (members.pageInfo && members.pageInfo.hasNextPage) {
    const {organization: om} = await octokit.graphql(membersQuery, {
      org,
      team,
      page: members.pageInfo.endCursor
    })

    await getMembers(octokit, org, om.team, data)
  }

  if (members && members.nodes) {
    for (const m of members.nodes) {
      data.push({
        title: `${m.name || m.login}`,
        subtitle: `@${m.login}`,
        arg: `member @${m.login}`,
        autocomplete: `@${m.login}`,
        match: [m.login, m.name || ''].join(', '),
        icon: memberIcon,
        type: 'default',
        valid: true,
        quicklookurl: `${m.avatarUrl}&size=200`,
        mods: {
          cmd: {
            subtitle: `https://github.com/${m.login}`,
            arg: `url https://github.com/${m.login}`
          }
        }
      })
    }
  }

  return data
}

;(async () => {
  const {packageJson: pkg} = await readPackageUp()

  const auth = alfy.config.get('token') || false
  const org = alfy.config.get('org')
  const team = alfy.config.get('team')

  if (!auth || typeof auth !== 'string' || auth.length < 1) {
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
            arg: `url ${subtitle}`,
            subtitle
          }
        }
      }
    ])
  }

  const lastcheck = alfy.cache.get('lastcheck')

  let items = []
  const teams = []
  const members = []

  if (!org || !team) {
    return alfy.output([
      {
        title: `Couldn't find your organisation or team`,
        subtitle: 'Please provide them in the form `org/team`',
        arg: `orgteam ${alfy.input}`,
        icon: {
          type: 'png',
          path: resolve(__dirname, '../assets/team.png')
        }
      }
    ])
  }

  if (Date.now() < lastcheck + 1000 * 60 * 60 * 24) {
    const t = alfy.cache.get('teams')
    const m = alfy.cache.get('members')

    if (alfy.debug) {
      const debugIcon = {
        type: 'png',
        path: resolve(__dirname, '../assets/debug.png')
      }

      items.push({
        title: `teams ${t.length || 0}`,
        subtitle: `cached(${new Date(lastcheck).toLocaleString()}) | reset(${new Date(
          lastcheck + 1000 * 60 * 60 * 24
        ).toLocaleString()})`,
        match: 'debug',
        icon: debugIcon,
        type: 'default',
        valid: false
      })
      items.push({
        title: `members ${m.length || 0}`,
        subtitle: `cached(${new Date(lastcheck).toLocaleString()}) | reset(${new Date(
          lastcheck + 1000 * 60 * 60 * 24
        ).toLocaleString()})`,
        match: 'debug',
        icon: debugIcon,
        type: 'default',
        valid: false
      })
    }

    items.push(...t)
    items.push(...m)
  } else {
    const octokit = new Octokit({
      auth,
      userAgent: pkg.name
    })

    const {organization: o} = await octokit.graphql(teamQuery, {org, team})
    const {organization: om} = await octokit.graphql(membersQuery, {org, team, page: null})

    await getTeams(o.team, teams)
    await getMembers(octokit, org, om.team, members)

    teams.sort(sortTeams)

    items = [...teams, ...members]

    alfy.cache.set('teams', teams)
    alfy.cache.set('members', members)
    alfy.cache.set('lastcheck', Date.now())
  }

  const outout = alfy.inputMatches(items, 'match')

  return alfy.output(outout)
})()
