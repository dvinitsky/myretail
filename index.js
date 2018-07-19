const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://heroku_75zdms2r:3rfek657p2ha1h7dskti6ovug3@ds143511.mlab.com:43511/heroku_75zdms2r';
const dbName = 'heroku_75zdms2r';

// Start MongoDB connection
MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to some Mongo server!");

  const db = client.db(dbName);
  const collection = db.collection('products');

  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  // BEGIN ROUTES //
  app.get('/', (req, res) => {
    res.render('pages/main');
  });





  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  client.close();
});



