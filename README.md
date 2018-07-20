**myRetail API Documentation**

To access, send an HTTP request to "https://vinitsky-myretail.herokuapp.com/products/{id}". The ID should be the eight-digit Target product ID.

The API will return a JSON object in the following format:
{"id":{id},"name":{product name},"current_price":{"value": {price},"currency_code":{currency code}}}

Product ID and name are pulled from the Target.com product page, i.e. https://www.target.com/p/the-big-lebowski-blu-ray/-/A-13860428. The price info is pulled from my MongoDB database hosted in mLab, hosted on Heroku.

The following IDs are available in the MongoDB databse for this case study:
13860428  
14090750  
16700437  
11335147  
11346672
