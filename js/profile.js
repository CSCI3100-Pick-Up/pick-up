/*
PROGRAM PROFILE - Program to manipulate user's profile
PROGRAMMER: Leung Wing Keung 1155062425@link.cuhk.edu.hk
CALLING SEQUENCE: HTTP://LOCALHOST:8081/PROFILE
VERSION 1: written 3-4-2018
PURPOSE: users can look at their profiles and change their images
DATA STRUCTURE: Variable userid - STRING
  ARRAY interests - STRING array of users' interests
ALGORITHM: get the user's interests, and push them into the array 'interests'
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

app.get('/profile', async (req, res) => {
	var userid;
	if(req.session.user === undefined){
		res.redirect('/');
	}
	else{
		await model.User.findOne({email: req.session.user}, function(err,result){
			if(err){
				console.log(err);
				res.serverError(err);
			}
			else{
				userid = result._id;
				res.locals.name = result.username;
				res.locals.email = result.email;
				res.locals.imgfile = result.image;
			}
		});

		var interests =[];
		var interestsImg = "<br>";
		await model.Schedule.find({owner: userid},function(err,result){
			if(err){
				console.log(err);
				res.serverError(err);
			}
			else{
				for(var i = 0; i < result.length; i++){
					if( interests.indexOf(result[i].content) === -1 ){
						if(result[i].content != 'Midterms' &&
								result[i].content != 'Lecture' &&
								result[i].content != 'Tutorial' &&
								result[i].content != 'Exam'){
							interests.push(result[i].content);
						}
					}
				}
				for(var i = 0; i < interests.length; i++){
					interestsImg += "<br>" + interests[i];
					interestsImg += "<img src = '../icons/" + interests[i] + ".png'/>";
				}
				res.locals.interestsPng = interestsImg;
				res.render('ProfilePage.ejs', { title: 'PickUp - Profile' });
			}
		});
	}
});
