const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var response = {
    title: 'TateShop',
    error: null,
    message: null
  };
  if (req.session.messages) {
    response.error = 'Login';
    response.message = req.session.messages[0];
  }
  res.render('index', response);
});

module.exports = router;
