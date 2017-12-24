const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongodb = require('mongodb').MongoClient;
const mongourl = process.env.MLAB;
const bcrypt = require('bcrypt');

module.exports = function () {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function (username, password, done) {
    mongodb.connect(mongourl, (err, db) => {
      if (err) throw err;
      var collection = db.collection('users');
      collection.findOne({username: username}, (err, results) => {
        if (err) throw err;
        if(results) {
          pazzword = results.password;
        } else {
          pazzword = '';
        }
        bcrypt.compare(password, pazzword, (err, res) => {
          if (err) throw err;
          if (res === true) {
            var user = results;
            done(null, user);
          } else {
            done(null, false, {error: 'login', message: 'Bad password'});
          }
        });
      });
    });
  }));
};
