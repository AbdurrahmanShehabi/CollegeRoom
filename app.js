const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const CONFIG = require('./config.json');
const PORT = parseInt(CONFIG.server.port, 10);
const HOST_NAME = CONFIG.server.hostName;
const DATABASE_NAME = CONFIG.database.name;
const DATABASE_PORT = CONFIG.database.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

mongoose.connect('mongodb://' + HOST_NAME + ':' + DATABASE_PORT + '/' + DATABASE_NAME, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected');
  }
});

const routes = require('./routes/routes');
app.use('/api/', routes);

const server = app.listen(PORT, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
