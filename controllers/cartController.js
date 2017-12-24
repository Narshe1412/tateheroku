const mongodb = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongourl = process.env.MLAB;

const cartController = (itemService, nav) => {
  const getCart = (req, res, next) => {
    var user = req.user.username;

    mongodb.connect(mongourl, (err, db) => {
      if (err) throw err;
      var collection = db.collection('users');
      collection.findOne({ username: user }, (err, userDetails) => {
        if (err) throw err;
        var oIDs = [];
        if (userDetails.cart) oIDs = userDetails.cart.map(x => ObjectID(x.item));
        var items = db.collection('items');
        items.find({ '_id': { '$in': oIDs } }).toArray((err, itemlist) => {
          if (err) throw err;
          for (let i = 0; i < itemlist.length; i++) {
            userDetails.cart.map(x => {
              if (x.item == itemlist[i]._id) {
                itemlist[i].quantity = x.quantity;
              }
            });
          }
          res.render('cart', {
            title: 'Shopping Cart',
            cart: itemlist,
            PRINTPRICE: 19.99
          });
        });
      });
    });
  };

  const addToCart = (req, res, next) => {
    mongodb.connect(mongourl, (err, db) => {
      if (err) throw err;
      var itemToUpdate = req.body.id;
      var quantityToUpdate = +req.body.qty || 1;
      var user = req.user.username;

      var userCollection = db.collection('users');
      userCollection.findOne({ username: user, 'cart.item': itemToUpdate }, (err, userDetails) => {
        if (err) throw err;
        if (userDetails) {
          for (let i = 0; i < userDetails.cart.length; i++) {
            if (userDetails.cart[i].item === itemToUpdate) {
              userDetails.cart[i].quantity = quantityToUpdate;
            }
          }
          userCollection.updateOne({ username: user }, userDetails, (err, results) => {
            if (err) throw err;
            res.send(results);
            db.close();
          });
        } else {
          userCollection.updateOne({ username: user }, { $push: { cart: { item: itemToUpdate, quantity: 1 } } }, (err, results) => {
            if (err) throw err;
            res.send(results);
            db.close();
          });
        }
      });
    });
  };

  const removeFromCart = (req, res, next) => {
    mongodb.connect(mongourl, (err, db) => {
      if (err) throw err;

      var user = req.user.username;

      var collection = db.collection('users');
      collection.updateOne({ username: user }, { $pull: { cart: { item: req.params.id } } }, (err, results) => {
        if (err) throw err;
        res.send(results);
        db.close();
      });
    });
  };

  const processCart = (req, res, next) => {
    var user = req.user.username;
    mongodb.connect(mongourl, (err, db) => {
      if (err) throw err;
      var collection = db.collection('users');
      collection.findOneAndUpdate({ username: user }, { $unset: { cart: 1 } }, (err, userDetails) => {
        if (err) throw err;
        var oIDs = [];
        if (userDetails.value.cart) oIDs = userDetails.value.cart.map(x => ObjectID(x.item));
        var items = db.collection('items');
        items.find({ '_id': { '$in': oIDs } }).toArray((err, itemlist) => {
          if (err) throw err;
          for (let i = 0; i < itemlist.length; i++) {
            userDetails.value.cart.map(x => {
              if (x.item == itemlist[i]._id) {
                itemlist[i].quantity = x.quantity;
              }
            });
          }
          var orders = db.collection('orders');
          orders.insert({user: req.user.username, orderDetails: itemlist, timestamp: new Date()}, (err, response) => {
            if (err) throw err;
            res.render('checkout', {
              title: 'Orders',
              cart: response.ops[0],
              PRINTPRICE: 19.99
            });
          });
        });
      });
    });
  };

  return {
    getCart: getCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    processCart: processCart
  };
};

module.exports = cartController;
