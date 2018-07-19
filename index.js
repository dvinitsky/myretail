const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");


app.use(bodyParser.urlencoded({ extended: false }));

const url = 'mongodb://heroku_75zdms2r:3rfek657p2ha1h7dskti6ovug3@ds143511.mlab.com:43511/heroku_75zdms2r';
const dbName = 'heroku_75zdms2r';

// API Endpoint provided for test case //
const testId = 13860428;
const testExclude = 'taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics';


//////////////////////////////////////////
const findDocument = function (collection, id, callback) {
  collection.findOne({ 'id': id }, function (err, result) {
    assert.equal(err, null);
    console.log("Found it!")
    console.log(result);
    callback(result);
  });
}


// START MONGODB CONNECTION //
MongoClient.connect(url, { useNewUrlParser: true, connectTimeoutMS: 30000 }, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to some Mongo server!");

  const db = client.db(dbName);
  const collection = db.collection('products');

  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');


  // BEGIN ROUTES //
  app.get('/products/:id', (req, res) => {
    // Calls Redsky API to get product info //
    async function getData(id, excludesString) {
      try {
        let response = await fetch(`https://redsky.target.com/v2/pdp/tcin/${id}?excludes=${excludesString}`);
        if (response.ok) {
          let jsonResponse = await response.json();

          let productName = jsonResponse.product.item['product_description'].title;



          res.send({ 'productName': productName, 'productId': req.params.id });
          return;
        }
        throw new Error('Request failed.');
      } catch (error) {
        console.log(error);
      }
    }

    getData(req.params.id, testExclude);


  });

  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
});



