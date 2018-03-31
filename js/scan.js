const app = require('express').Router()
const py = require('python-shell')
module.exports = app

const title = 'PickUp - Scan Result'
app.get('/display-matches',
        (req,
         res) => {if (!req.session.user)
                  res.redirect('/')
                  else py.run('scan.py',
                              {args: [req.session.user]},
                              (err,
                               table) => {if (err)
                                          console.log(err)
                                          else res.render('display-matches.ejs',
                                                          {title: title,
                                                           table: table})})})
