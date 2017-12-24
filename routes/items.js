const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController')(null, null);

/* Auth Middleware */
router.use((req, res, next) => {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
});
/* GET item listing. */
router.get('/:id', itemController.getByID);
router.get('/', itemController.getIndex);

module.exports = router;
