const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.send(`200 ok`);
});

module.exports = router