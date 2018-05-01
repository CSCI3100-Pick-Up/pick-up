/*
PROGRAM CHATROOM - Program to receive "get/post" request of /chatroom
PROGRAMMER: Leung Wing Keung 1155062425@link.cuhk.edu.hk
CALLING SEQUENCE: HTTP://LOCALHOST:8081/CHATROOM or POST CHATROOM(EMAIL)
	Where 'EMAIL' is the email address of the person who is confirmed by the user.
VERSION 1: writen 3-4-2018
PURPOSE: For get request, the user goes to his/her own chatroom. For post request, the user goes to another user's chatroom after he/she confirmed.
DATA STRUCTURE: Variable EMAIL - STRING
ALGORITHM: If a get request is received, render chatroom page. If a post request is received, redirect to a chatroom which named 'EMAIL'
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
