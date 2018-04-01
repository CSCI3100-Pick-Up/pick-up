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

app.post('/report', urlencodedParser, async (req, res) => {
	if(req.session.user === undefined){
		res.render('landingLogin.ejs', { title: 'PickUp' });
	}
	else{
		await model.Blacklist.create({
			blacklisteduser: req.body.bluser,
			byuser: req.session.user,
			didnotshowup: req.body.cb1 !== undefined,
			badbehavior: req.body.cb2 !== undefined,
			detail: req.body.description
			}, function(err, record){
				if(err){
					console.log(err);
					res.send(err);
				}
				else{
					res.redirect('/schedule');
				}
			}
		);
	}
});
