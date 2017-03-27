var mysql = require('mysql')
  , async = require('async')

var PRODUCTION_DB = 'oscars'
  , TEST_DB = 'app_test_database'

exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'


exports.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: 'localhost',
    user: 'oscarsuser',
    password: 'hepburn',
    database: 'oscars'
  })

  state.mode = mode
  done()
}

exports.get = function() {
  return state.pool
}