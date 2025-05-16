const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('index.hbs');
});

router.get('/demo/', (req, res) => {
    res.render('app.hbs');
})

module.exports = router