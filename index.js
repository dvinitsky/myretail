const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

app.use(bodyParser.json({ type: 'application/json', extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const url = 'mongodb://heroku_75zdms2r:3rfek657p2ha1h7dskti6ovug3@ds143511.mlab.com:43511/heroku_75zdms2r';
const dbName = 'heroku_75zdms2r';

const excludeForTest = 'taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics';

MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
  if (err) throw err;
  console.log("Connected successfully to Mongo server!");

  const db = client.db(dbName);
  const collection = db.collection('products');

  app.get('/products/:id', (req, res) => {
    // Call Redsky API to get product info
    (async () => {
      try {
        let response = await fetch(`https://redsky.target.com/v2/pdp/tcin/${req.params.id}?excludes=${excludeForTest}`);

        if (response.ok) {
          let jsonResponse = await response.json();

          let id = parseInt(req.params.id)

          collection.findOne({ 'id': id }, (err, result) => {
            if (err) throw err;
            res.send({ 'id': id, 'name': jsonResponse.product.item.product_description.title, 'current_price': result.current_price });
          });
          return;
        } throw new Error('Request failed.');
      } catch (error) {
        console.log(error);
      }
    })();
  });

  app.post('/products/:id', (req, res) => {
    collection.findOneAndUpdate({ 'id': parseInt(req.params.id) }, { $set: { 'current_price.value': req.body.price } }, { returnOriginal: false }, (err, result) => {
      if (err) throw err;
      console.log('Database updated.');
      res.send(result);
    });
  });

  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
});
// ** Do not explicitly close database connection- connection should close automatically when we're done. 

