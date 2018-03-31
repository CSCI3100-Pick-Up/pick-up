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

app.post('/report', urlencodedParser,(req, res) => {
	if(req.session.user === undefined){
		res.render('landingLogin.ejs', { title: 'PickUp' });
	}
	else{res.send('Not implement yet');
	}
});
