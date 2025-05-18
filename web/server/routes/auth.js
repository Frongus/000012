const express = require('express');
const router = express.Router();
const dataHandler = require('../modules/dataHandeling.js');

router.get('/', function(req, res) {
    res.send('login page');
});

router.get('/register/', function(req, res) {
 res.render('register.hbs');
});

router.get('/login/', (req, res) => {
    res.render('login.hbs');
});

router.post('/register/data/', async (req, res) => {
    const {
        nameStr,
        emailStr,
        passwordStr,
        usernameStr
    } = req.body

    res.json({
        "res": await dataHandler.createUser(emailStr, passwordStr, nameStr, usernameStr)
    });
});

router.post('/login/data/', async (req, res) => {
    const {
        passwordStr,
        usernameStr
    } = req.body

    const resData = await dataHandler.login(usernameStr, passwordStr)
    
    if(resData.username) {
        req.session.username = resData.username
    }

    res.json({
        "res": resData
    });
});

module.exports = router;