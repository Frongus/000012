const express = require('express');
const server = express();
require('dotenv').config('.env');
const session = require('express-session');
const port = process.env.PORT;
const secret = process.env.SECRET;
console.log(`Current Server Port: ` + process.env.PORT);

server.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
})); 
server.use(express.json());
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