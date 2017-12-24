const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')(null, null);
const passport = require('passport');

/* GET create account */
router.get('/signup', (req, res) => {
  res.render('index', {response: 'Create Account'});
});

/* POST create account */
router.post('/signup', authController.addUser);

/* GET signin account */
router.get('/signin', (req, res) => {
  res.render('index', {response: 'Login'});
});

/* POST login */
router.post('/signin', passport.authenticate('local', {failureRedirect: '/', failureMessage: 'Bad password'}), authController.logUser);

module.exports = router;
