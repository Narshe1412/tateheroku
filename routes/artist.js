const express = require('express');
const router = express.Router();
const mongodb = require('mongodb').MongoClient;
const mongourl = process.env.MLAB;

/* GET artist listing. */
router.get('/', function (req, res, next) {
  mongodb.connect(mongourl, (err, db) => {
    if (err) throw err;
    var collection = db.collection('artist');
    collection.find({}).toArray((err, results) => {
      if (err) throw err;
      res.render('artist', {
        title: 'Artists Homepage',
        artists: results
      });
    });
  });
});

module.exports = router;
