const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('index.hbs');
});

router.get('/policy/', (req, res) => {
    res.render('policy.hbs');
});

router.get('/app/workbench/', (req, res) => {
    if(!req.session.username) {
        res.redirect('/auth/login/');
    } else {
        res.render('app.hbs');
    }
});

module.exports = router