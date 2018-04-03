// This file contains the login/signup rules for the app

let express = require('express');
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended:false});
let jsonParser = bodyParser.json({});

// For constructing query string from object properties
const Query = require('query-string');

// For convenience, just name the router 'app'
let app = require('express').Router();

let model = require('./model.js');
var bcrypt = require('bcryptjs');

module.exports = app;


app.post('/login', urlencodedParser, async (req, res) => {
	var num = 1;
	await model.User.find({email: req.body.email},function(err,result){
		num = result.length;

	});
	if (num != 0 && await model.authenticate(req.body.email, req.body.password) === true) {
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
		res.render('landingLogin.ejs',
      { title: 'PickUp',
        loginMsg: 'Incorrect email or password! Please try again.',
        email: req.body.email
      }
    );
  }
});

app.post('/sign', urlencodedParser, async (req, res) => {
	if(req.session.user === undefined){
		var repeat = -1;
		await model.User.find({email: req.body.email}).exec(function(err,result){
			repeat = result.length;
		});
		if(repeat === 0){
			if (req.body.email.includes("@cuhk.edu.hk")) {
				await model.User.create({
					username: req.body.username,
					email: req.body.email,
					password: bcrypt.hashSync(req.body.password)
				}, function(err, result){
					if(err)
						console.log(err);
					else{
						console.log(result);
					}
				});
				res.redirect('/profile');
			}
			else {
				req.session.destroy(()=>{});  // Safe asyncrhous call
				res.render('signUp.ejs',
		      { title: 'PickUp - Sign Up',
		        signupMsg: 'You should use the school email! Please try again.',
		        email: req.body.email
		      }
		    );
			}
		}
		else{
			req.session.destroy(()=>{});  // Safe asyncrhous call
			res.render('signUp.ejs',
				{ title: 'PickUp - Sign Up',
					signupMsg: 'The user already exists! Please try login.',
					email: req.body.email
				}
			);
		}
	}
	else{
		res.redirect('/schedule');
	}
});

app.get('/loggedIn', (req, res)=>{
	model.User.find({},(err,result)=>{
		//console.log(result);
	});
  if (req.session.user === undefined) {
    res.send(false);
  }
  else {
    model.User.findOne({email: req.session.user}, 'username', (err, name)=>{
       if (err) {
        model.errHandler(err, res);
       }
       else {
         var dummy = {value: true, user:req.session.user, username: name.username};
         res.send(dummy);
  	   }
    });
  }
});
