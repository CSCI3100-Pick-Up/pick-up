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

app.get('/loggedIn', require('./loginSignUp.js'));

app.post('/login', require('./loginSignUp.js'));

app.post('/sign', require('./loginSignUp.js'));

app.get('/schedule/getschedule', require('./scheduleRoute.js'));

app.get('/schedule/newschedule', require('./scheduleRoute.js'));

app.get('/schedule/updateschedule', require('./scheduleRoute.js'));

app.get('/schedule/deleteschedule', require('./scheduleRoute.js'));

app.get('/', (req, res) => {
	if (req.session.user){
		res.redirect('/profile');
	}
	else {
		res.render('landingLogin.ejs', { title: 'PickUp' });
	}
});

app.get('/signUp', (req, res) => {
	if (req.session.user){
		res.redirect('/profile');
	}
	else {
		res.render('signUp.ejs', { title: 'PickUp - Sign Up' });
	}

});

app.get('/profile', require('./profile.js'));

app.get('/matches', require('./matches.js'));

app.get('/schedule', (req, res) => {
	if (req.session.user){
			res.render('schedule.ejs', { title: 'PickUp - Schedule' });
	}
	else {
		res.redirect('/');
	}
});

app.get('/report', (req, res) => {
	if (req.session.user){
			res.render('report.ejs', { title: 'PickUp - Report' });
	}
	else {
		res.redirect('/');
	}
});

app.get('/logout', (req, res) => {
  req.session.destroy(()=>{});   // Safe asyncrhonus call
  res.redirect('/');
});

app.post('/report', require('./report.js'));

app.get('/chatroom', require('./chatroom.js'));
// CSS files, images, client-side JS files should be in ./public
app.use(express.static('public'));
