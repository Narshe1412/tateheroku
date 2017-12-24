const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController')(null, null);

/* Auth Middleware */
router.use((req, res, next) => {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
});
/* POST checkout */
router.post('/', cartController.processCart);

module.exports = router;
