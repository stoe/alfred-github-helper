import alfy from 'alfy'

// execute
;(async () => {
  const token = process.argv[2]

  alfy.config.set('token', token)
})()
