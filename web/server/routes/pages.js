const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('index.hbs');
});

router.get('/policy/', (req, res) => {
    res.render('policy.hbs');
});

router.get('/chat/', (req, res) => {
    if(!req.session.username) {
        res.redirect('/auth/login/');
    } else {
        res.render('chat.hbs');
    }
});

router.get('/chat/settings/', (req, res) => {
    if(!req.session.username) {
        res.redirect('/auth/login/');
    } else {
        res.render('chatSettings.hbs');
    }
});

module.exports = router