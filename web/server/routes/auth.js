const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.send('login page');
});

module.exports = router;