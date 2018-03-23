// This file contains the routing rules for the app

let express = require('express');
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended:false});
let jsonParser = bodyParser.json({});

// For constructing query string from object properties
const Query = require('query-string');

// For convenience, just name the router 'app'
let app = require('express').Router();

let model = require('./model.js');

module.exports = app;

// Use a separate router for ajax request
//app.use('/ajax', require('./ajaxRoutes.js'));

var path = require('path');

app.post('/login', require('./loginSignUp.js'));

app.post('/sign', require('./loginSignUp.js'));

app.get('/', (req, res) => {
	res.render('landingLogin.ejs', { title: 'PickUp' });
});

app.get('/signUp', (req, res) => {
	res.render('signUp.ejs', { title: 'PickUp - Sign Up' });
});

app.get('/profile', (req, res) => {
	res.render('ProfilePage.ejs', { title: 'PickUp - Profile' });
});

app.get('/display-matches', (req, res) => {
	res.render('display-matches.ejs', { title: 'PickUp - Scan Result' });
});

app.get('/schedule', (req, res) => {
	res.render('schedule.ejs', { title: 'PickUp - Schedule' });
});

app.get('/report', (req, res) => {
	res.render('report.ejs', { title: 'PickUp - Report' });
});


app.post('/report', urlencodedParser, async (req, res) => {
  res.send("Not implement yet");
});
// CSS files, images, client-side JS files should be in ./public
app.use(express.static('public'));
