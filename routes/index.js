const express = require('express');
const router = express.Router();

// GET /
router.get('/', function (req, res) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function (req, res) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function (req, res) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
