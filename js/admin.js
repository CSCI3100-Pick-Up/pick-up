// This file contains the schedule rules for the app

/*
PROGRAM ADMIN - Program to prepare data and redirect to admin page
PROGRAMMER: Wong Muk Kit 1155063275@link.cuhk.edu.hk
CALLING SEQUENCE: HTTP://LOCALHOST:8081/admin
VERSON 1: written 3-4-2018
PURPOSE: The admin can view all the user's information and report details from the database
DATA STRUCTURE:
  Variable req.session.user - STRING
  Variable ReportData - OBJECT
  Variable UserData - OBJECT

ALGORITHM: It first check whether the connecting user is the admin. Then it will retrieve ReportData and UserData from the report database and user database respectively and return the results to the admin page for rendering
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

app.all('/admin', async (req, res)=>{
  if (!(req.session.user === 'admin')) {
    res.redirect('/');
    return;
  }
  try {
    let ReportData = await model.Blacklist.find({}).exec();
    let UserData = await model.User.find({}).exec();
    // Step 5: Render the view
    res.render('admin.ejs', { title: 'Admin page', ReportData: ReportData, UserData: UserData});
  } catch (err) {
    model.errHandler(err, res);
}
});
