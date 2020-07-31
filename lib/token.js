'use strict'
;(async () => {
  const alfy = require('alfy')
  const token = process.argv[2]

  alfy.config.set('token', token)
})()
