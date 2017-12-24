const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController')(null, null);

/* Auth middleware */
router.use((req, res, next) => {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
});
/* GET item listing. */
// router.get('/:id', cartController.getByID);
router.get('/', cartController.getCart);
router.get('/:id', cartController.getCart);
/* PUT item to cart */
router.put('/:id', cartController.addToCart);
/* DELETE item from cart */
router.delete('/:id', cartController.removeFromCart);

module.exports = router;
