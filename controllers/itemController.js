const mongodb = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongourl = process.env.MLAB;

const itemController = (itemService, nav) => {
  const getIndex = (req, res, next) => {
    var maxItems = +req.query.count || 20;
    var skipItems = req.query.page * maxItems || 0;
    var filter = req.query.filter || 'name';
    var search = new RegExp('.*' + (req.query.search || 'sunset') + '.*', 'i');
    var objFilter = {};
    objFilter[filter] = 1;

    mongodb.connect(mongourl, (err, db) => {
      if (err) throw err;
      var collection = db.collection('items');
      collection.find({title: search}).limit(maxItems).sort(objFilter).skip(skipItems).toArray((err, results) => {
        if (err) throw err;
        res.render('items', {
          title: 'Items Homepage',
          items: results,
          search: req.query.search
        });
      });
    });
  };

  const getByID = (req, res, next) => {
    var id = new ObjectID(req.params.id);

    mongodb.connect(mongourl, (err, db) => {
      if (err) throw err;
      var collection = db.collection('items');
      collection.findOne({_id: id}, (err, results) => {
        if (err) throw err;
        res.render('itemView', {
          title: results.name || results.medium || 'Tate Shop Item',
          item: results
        });
      });
    });
  };

  return {
    getIndex: getIndex,
    getByID: getByID
  };
};

module.exports = itemController;
