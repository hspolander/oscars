var db = require('./db');
var express = require('express');
app = express();

app.use('/forecast', require('./controllers/forecast'))
app.use('/oscars', require('./controllers/oscars'))

// Connect to MySQL on start
db.connect(db.MODE_PRODUCTION, function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  } else {
    app.listen(3000, function() {
      console.log('Listening on port 3000...')
    })
  }
})