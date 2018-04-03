// Source: https://github.com/mmukhin/psitsmike_example_2
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

app.get('/chatroom' ,(req, res) => {
	if(req.session.user === undefined){
		res.render('landingLogin.ejs', { title: 'PickUp' });
	}
	else{
		//res.locals.user2 = "Your friend's email here";
		res.locals.emailid = req.session.user;
		res.render('chatroom.ejs', { title: 'Chatroom'});
	}
});

app.post('/chatroom', (req,res)=>{
	res.render('chatroom.ejs', { title: 'Chatroom'});
});
