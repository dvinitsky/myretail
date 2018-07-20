const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
//const bodyParser = require('body-parser');
const fetch = require("node-fetch");

//app.use(bodyParser.urlencoded({ extended: false }));

const url = 'mongodb://heroku_75zdms2r:3rfek657p2ha1h7dskti6ovug3@ds143511.mlab.com:43511/heroku_75zdms2r';
const dbName = 'heroku_75zdms2r';

const testExclude = 'taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics';


// START MONGODB CONNECTION //
MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
  if (err) throw err;
  console.log("Connected successfully to Mongo server!");

  const db = client.db(dbName);
  const collection = db.collection('products');

  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  // BEGIN ROUTES //
  app.get('/products/:id', (req, res) => {
    // Call Redsky API to get product info //
    (async () => {
      try {
        let response = await fetch(`https://redsky.target.com/v2/pdp/tcin/${req.params.id}?excludes=${testExclude}`);
        if (response.ok) {
          let jsonResponse = await response.json();

          let productName = jsonResponse.product.item['product_description'].title;

          collection.findOne({ 'id': 11346672 }, (err, result) => {
            if (err) throw err;
            let priceInfo = result['current_price'];

            res.send({ 'id': req.params.id, 'name': productName, 'current_price': priceInfo });
          });

          return;
        } throw new Error('Request failed.');
      } catch (error) {
        console.log(error);
      }
    })();
  });
  // End of HTTP call

  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
});
// End of MongoDB connection


