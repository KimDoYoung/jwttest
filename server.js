//server.js
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
//db
mongoose.Promise = global.Promise;
const mlabURL = process.env.MONGO_DB_LOGIN_API;
mongoose.connect(mlabURL, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', () => {
  console.log('connection...  to mlab');
});
db.on('error', err => {
  console.log('DB Error :', err);
});
//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
  next();
});
//api
app.use('/api/users', require('./api/users'));
app.use('/api/auth', require('./api/auth'));
app.use('/', function(req, res, next){
  var hash =  bcrypt.hashSync('kalpa987')
  var password = 'kalpa987';
  // hash = 'kalpa987';
  var b = bcrypt.compareSync(password, hash);
  var r =  b ? 'OK' : 'NK';
  res.send(r + " " + hash);
});
//server
const port = 3000;
app.listen(port, () => {
  console.log('listening on : ' + port);
});
