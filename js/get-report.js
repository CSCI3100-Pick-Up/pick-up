const app = require('express').Router()
const py = require('python-shell')
module.exports = app

const title = 'PickUp - Report'

app.get('/report',

        (req, res) =>
        {if (!req.session.user)
         res.redirect('/')
         else py.run('py/users.py',
                     {args: [req.session.user]},

                     (err, datalist) =>
                     {if (err)
                      console.log(err)
                      else res.render('report.ejs', {title: title,
                                                     datalist: datalist})})})
