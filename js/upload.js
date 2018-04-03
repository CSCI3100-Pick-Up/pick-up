let express = require('express');
let bodyParser = require('body-parser');

// For constructing query string from object properties
const Query = require('query-string');

// For convenience, just name the router 'app'
let app = require('express').Router();

let model = require('./model.js');

module.exports = app;

var ID;
app.post('/upload', async function(req, res, next){
	await model.User.findOne({email: req.session.user},function(err, result){
		if(err){
			console.log(err);
			res.send('Server Error');
		}
		else{
			ID = result._id;
			result.image = '/img/' + ID;
			result.save();
			next();
		}
	});
});

var multer  = require('multer');
// Specify where to store the uploaded files
// The folder is created if it does not yet existed
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/');
  },
  filename: function (req, file, cb) {
    cb(null, ID.toString());
  }
})

var upload = multer({ storage: storage })
// Handling single file upload
app.post('/upload', upload.single('myfile'), async function (req, res){
	await model.User.findOne({email: req.session.user},function(err, result){
		if(err){
			console.log(err);
			res.send('upload Error');
		}
		else{
			res.locals.imgfile = result.image;
			res.redirect('/profile');
		}
	});
});
