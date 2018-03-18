// This file contains the routing rules for the app

let express = require('express');
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended:false});
let jsonParser = bodyParser.json({});

// For constructing query string from object properties
const Query = require('query-string');

// For convenience, just name the router 'app'
let app = require('express').Router();

//let model = require('./model.js');

module.exports = app;

// Use a separate router for ajax request
//app.use('/ajax', require('./ajaxRoutes.js'));
var path = require('path');
app.get('/', (req, res) => {
	res.sendFile('landingLogin.html', { root: path.join(__dirname, '../views') });
});

app.get('/profile', (req, res) => {
	res.sendFile('ProfilePage.html', { root: path.join(__dirname, '../views') });
});

app.get('/schedule', (req, res) => {
	res.sendFile('schedule.html', { root: path.join(__dirname, '../views') });
});

app.get('/report', (req, res) => {
	res.sendFile('report.html', { root: path.join(__dirname, '../views') });
});

app.get('/display-matches',
        (req, res) => {res.sendFile('display-matches.html',
                                    {root: path.join(__dirname,
                                                     '../views')});});

app.post('/login', urlencodedParser, async (req, res) => {
  res.send("Not implement yet");
});

app.post('/report', urlencodedParser, async (req, res) => {
  res.send("Not implement yet");
});
// CSS files, images, client-side JS files should be in ./public
app.use(express.static('public'));
