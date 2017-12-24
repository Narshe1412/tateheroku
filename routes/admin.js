const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')(null, null);

/* Auth middleware */
router.use((req, res, next) => {
  if (!req.user) {
    res.redirect('/');
  } else if (req.user.username === 'admin') {
    next();
  } else {
    res.redirect('/');
  }
});

/* GET admin */
router.get('/', function (req, res, next) {
  res.render('admin', {
    title: 'Admin'
  });
});
router.post('/add', adminController.addItem);

module.exports = router;
