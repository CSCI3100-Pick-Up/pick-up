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

app.all('/admin', async (req, res)=>{
  //if (!(req.session.user === 'admin')) {
    //res.redirect('/');
    //return;
  //}
  try {
    let Data = await model.Blacklist.find({}).exec();
    // Step 5: Render the view
    res.render('admin.ejs', { title: 'Admin page', ReportData: Data});
  } catch (err) {
    model.errHandler(err, res);
}
});
