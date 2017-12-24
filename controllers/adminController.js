const mongodb = require('mongodb').MongoClient;
const mongourl = process.env.MLAB;

const adminController = (itemService, nav) => {
  const addItem = (req, res, next) => {
    mongodb.connect(mongourl, (err, db) => {
      if (err) throw err;
      var collection = db.collection('items');
      collection.insert(req.body, (err, results) => {
        if (err) throw err;
        res.redirect('/admin');
      });
    });
  };

  return {
    addItem: addItem
  };
};

module.exports = adminController;
