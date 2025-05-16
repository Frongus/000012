const express = require('express');
const server = express();
require('dotenv').config('.env');
const port = process.env.PORT
console.log(`Current Server Port: ` + process.env.PORT);

server.use('/auth/', require('./routes/auth.js'));
server.use('/', require('./routes/pages.js'));
server.use(express.static('./public'));
server.set('view engine', 'hbs');

server.listen(port, function(err) {
    if(err) {
        return err
    } else {
        console.log(`Webinstance running on port ${port}`);
    }
});