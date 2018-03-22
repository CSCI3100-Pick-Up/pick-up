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
app.get('/', (req, res) => {
	res.sendFile('landingLogin.html', { root: path.join(__dirname, '../views') });
});

app.get('/signUp', (req, res) => {
	res.sendFile('signUp.html', { root: path.join(__dirname, '../views') });
});

app.get('/profile', (req, res) => {
	res.sendFile('ProfilePage.html', { root: path.join(__dirname, '../views') });
});

app.get('/display-matches', (req, res) => {
	res.sendFile('display-matches.html', {root: path.join(__dirname,'../views')});
});

app.get('/schedule', (req, res) => {
	res.sendFile('schedule.html', { root: path.join(__dirname, '../views') });
});

app.get('/report', (req, res) => {
	res.sendFile('report.html', { root: path.join(__dirname, '../views') });
});

app.post('/login', urlencodedParser, async (req, res) => {
	if (await model.authenticate(req.body.email, req.body.password) === true) {
    // req.session.regenerate() is asynchronous but it does not return a promise.
    // In order to use await, the function call is then wrapped in a Promise object
    await new Promise((resolve, reject)=> {
      req.session.regenerate(resolve);      // Recreate the session
    });
    req.session.user = req.body.email;  // To represent successful login
    res.redirect('/schedule');
		console.log('successful login');

  }
  else {
    req.session.destroy(()=>{});  // Safe asyncrhous call
    res.redirect('/');
		console.log('login fail');
  }
});

app.post('/sign', urlencodedParser, async (req, res) => {
  res.send("Not implement yet");
});

app.post('/report', urlencodedParser, async (req, res) => {
  res.send("Not implement yet");
});
// CSS files, images, client-side JS files should be in ./public
app.use(express.static('public'));
