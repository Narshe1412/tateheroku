const mongodb = require('mongodb').MongoClient;
const mongourl = process.env.MLAB;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const authController = (itemService, nav) => {
  const addUser = (req, res, next) => {
    mongodb.connect(mongourl, (err, db) => {
      if (err) throw err;
      var collection = db.collection('users');
      var user = {
        username: req.body.username,
        password: req.body.password
      };
      var response = {};
      response.error = null;
      if (user.username.length < 1) {
        res.render('index', {error: 'Name', reason: 'Name too short'});
      } else if (user.username.length > 20) {
        res.render('index', {error: 'Name', reason: 'Name too long'});
      } else if (user.password.length < 6) {
        res.render('index', {error: 'Password', reason: 'Password too short. Needs 6 characters'});
      } else if (user.password.length > 10) {
        res.render('index', {error: 'Password', reason: 'Password too long. 10 characters maximum'});
      } else {
        collection.findOne({username: user.username}, (err, results) => {
          if (err) throw err;
          if (!results) {
            bcrypt.genSalt(saltRounds, (err, salt) => {
              if (err) throw err;
              bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;
                collection.insert(user, (err, results) => {
                  if (err) throw err;
                  req.login(results.ops[0], function () {
                    res.redirect('/items');
                  });
                });
              });
            });
          } else {
            res.render('index', {error: 'Name', reason: 'User already in database'});
          }
        });
      }
    });
  };

  const logUser = (req, res, next) => {
    if (!req.user) {
      res.redirect('/');
    } else if (req.user.username === 'admin') {
      res.redirect('/admin');
    } else {
      res.redirect('/items');
    }
  };

  return {
    addUser: addUser,
    logUser: logUser
  };
};

module.exports = authController;
