const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('index.hbs');
});

router.get('/demo/', (req, res) => {
    res.render('app.hbs');
});

router.get('/policy/', (req, res) => {
    res.render('policy.hbs');
});

module.exports = router