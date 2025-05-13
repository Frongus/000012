const express = require('express');
const server = express();
require('dotenv').config;
const port = process.env.PORT
console.log(`Current Server Port: ` + process.env.PORT);

server.get('/', require('./routes/pages.js'));
server.use(express.static('./public'));

server.listen(port, function(err) {
    if(err) {
        return err
    } else {
        console.log(`Webinstance running on port ${port}`);
    }
});