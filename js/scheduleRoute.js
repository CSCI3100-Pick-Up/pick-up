// This file contains the schedule rules for the app

/*
PROGRAM SCHEDULE - Program to handle request concerning schedule for users
PROGRAMMER: Wong Muk Kit 1155063275@link.cuhk.edu.hk
CALLING SEQUENCE: HTTP://LOCALHOST:8081/schedule/
VERSON 1: written 3-4-2018
PURPOSE: users can retrieve, add, edit and delete events from their own schedule
DATA STRUCTURE:
  Variable req.session.user - STRING
  Variable req.query.content - STRING
  Variable req.query.endDate - INTEGER
  Variable req.query.startDate - INTEGER
  Variable req.query.OldstartDate - INTEGER
  Variable req.query.OldendDate - INTEGER
  Variable req.query.NewendDate - INTEGER
  Variable req.query.NewstartDate - INTEGER
ALGORITHM: For getschedule, it first find the user's id from the database using the user email as search criteria. Then retrieve the schedule data from the database using user's id and return the schedule data to user.
For newschedule, it first find the user's id from the database using the user email as search criteria. Then create a new schedule object using req.query.content, req.query.startDate and req.query.EndDate and save the new schedule to the corresponding user's schedule databse.
For updateschedule, it first find the user's id from the database using the user email as search criteria. Then we obtain all the schedules for that user. We find the event that the user want to edit by comparing their startDate and endDate, then do the update for database.
For deleteschedule, it first find the user's id from the database using the user email as search criteria. Then we obtain all the schedules for that user. We find the event that the user want to delete by comparing their startDate and endDate, then do the delete for database.
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

//Retreive the schedule
app.get('/schedule/getschedule', (req, res)=>{
  if (req.session.user) {
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
            res.send(result);
          }
        });
      }
    });
  }
  else {
    res.redirect('/');
  }
});


//Create a new schedule and save to the database
app.get('/schedule/newschedule', (req, res)=>{
  if (req.session.user) {
    model.User.findOne({email: req.session.user}, '_id', (err, id)=>{
      if (err) {
        model.errHandler(err, res);
      }
      else {
        var schedule = new model.Schedule({owner: id._id, content: req.query.content, endDate: req.query.endDate, startDate: req.query.startDate});
        schedule.save(function (err) {
          if (err) {
            model.errHandler(err, res);
          }
          else {
            res.send(true);
          }
        });
      }
    });
  }
  else {
    res.send(false);
  }

});

//Update a particular existing schedule
app.get('/schedule/updateschedule', (req, res)=>{
  if (req.session.user) {
    model.User.findOne({email: req.session.user}, '_id', (err, id)=>{
      if (err) {
        model.errHandler(err, res);
      }
      else {
        model.Schedule.find({owner: id._id}, (err, schedule)=>{
          for (i=0; i<schedule.length;i++) {
            if ((req.query.OldstartDate == schedule[i].startDate) && (req.query.OldendDate == schedule[i].endDate)){
              schedule[i].content = req.query.content;
              schedule[i].startDate = req.query.NewstartDate;
              schedule[i].endDate = req.query.NewendDate;
              schedule[i].save();
              break;
            }
          }
          res.send(true);
        });
      }
    });
  }
  else {
    res.send(false);
  }

});


//Delete an existing schedule
app.get('/schedule/deleteschedule', (req, res)=>{
  if (req.session.user) {
    model.User.findOne({email: req.session.user}, '_id', (err, id)=>{
      if (err) {
        model.errHandler(err, res);
      }
      else {
        model.Schedule.find({owner: id._id, content: req.query.content}, (err, schedule)=>{
          for (i=0; i<schedule.length;i++) {
            if ((req.query.startDate == schedule[i].startDate) && (req.query.endDate == schedule[i].endDate)) {
              schedule[i].remove();
              break;
            }
          }
          res.send(true);
        })
      }
    });
  }
  else {
    res.send(false);
  }
});
