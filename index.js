const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const fetch = require("node-fetch");

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

          let productName = jsonResponse.product.item['product_description'].title;

          collection.find().toArray((err, result) => {
            if (err) throw err;

            let product = result.find(item => item.id == req.params.id);

            res.send(product);
          });
          return;
        } throw new Error('Request failed.');
      } catch (error) {
        console.log(error);
      }
    })();
  });

  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
});
// ** Do not explicitly close database connection- connection should close automatically when we're done. 

