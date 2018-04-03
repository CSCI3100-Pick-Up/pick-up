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

app.get('/chatroom', urlencodedParser,(req, res) => {
	/*if(req.session.user === undefined){
		res.render('landingLogin.ejs', { title: 'PickUp' });
	}
	else*/{
		//res.locals.user2 = "Your friend's email here";
		res.render('chatroom.ejs', { title: 'Chatroom'});
	}
});
