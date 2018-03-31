// This file contains the schedule rules for the app

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
app.get('/schedule/getschedule', (req, res)=>{
  model.User.findOne({email: req.session.user}, '_id', (err, id)=>{
    if (err) {
      model.errHandler(err, res);
    }
    else {
      model.Schedule.find({owner: id._id}, (err, result)=>{
        if (err) {
          model.errHandler(err, res);
        }
        else {
          console.log(result);
          res.send(result);
        }
      });
    }
  });
});

app.get('/schedule/newschedule', (req, res)=>{
  console.log(req.query);
  res.send(true);
})
