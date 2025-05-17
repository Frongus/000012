const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.send('login page');
});

router.get('/register/', function(req, res) {
 res.render('register.hbs');
});

module.exports = router;