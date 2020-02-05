const express = require('express');
var http = require('http');

const connectDB = require ('./config/db');

const app = express();

app.use(express.json({extended: false}));


connectDB();

app.get('/', (req,res)=> res.send('Api running'));

//Define Routes
app.use ('/api/users', require('./routes/api/users'));
app.use ('/api/auth', require('./routes/api/auth'));
app.use ('/api/profile', require('./routes/api/profile'));
app.use ('/api/posts', require('./routes/api/posts'));

var PORT  = process.env.PORT || 5000;
app.listen (PORT , ()=> console.log("Express server started at" + PORT));

