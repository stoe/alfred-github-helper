import alfy from 'alfy'

// execute
;(async () => {
  const orgteam = process.argv[2]

  const [org, team] = orgteam.split('/')

  alfy.config.set('org', org.trim())
  alfy.config.set('team', team.trim())
})()
