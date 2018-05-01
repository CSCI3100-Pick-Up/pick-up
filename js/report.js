/*
PROGRAM REPORT - Program to report a user
PROGRAMMER: Leung Wing Keung 1155062425@link.cuhk.edu.hk
CALLING SEQUENCE: HTTP://LOCALHOST:8081/REPORT
VERSION 1: written 3-4-2018
PURPOSE: users can report another user who have bad behavoir
DATA STRUCTURE: Variable req.body.bluser - STRING
  Variable req.session.user - STRING
  Variable req.body.cb1 - BOOLEAN
  Variable req.body.cb2 - BOOLEAN
  Variable req.body.description - STRING
ALGORITHM: add a record to database with variables 'req.body.bluser', 'req.session.user', 'req.body.cb1', 'req.body.cb2', 'req.body.description'
*/

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
