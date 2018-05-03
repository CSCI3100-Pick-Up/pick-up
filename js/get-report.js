/* Pick-up --- Web application to connect students
   Copyright © 2018 Alex Vong <alexvong1995@gmail.com>

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU Affero General Public License as
   published by the Free Software Foundation, either version 3 of the
   License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.

   You should have received a copy of the GNU Affero General Public License
   along with this program.  If not, see <https://www.gnu.org/licenses/>.  */

const app = require('express').Router()
const py = require('python-shell')
module.exports = app

/* Title of the page.  */
const title = 'PickUp - Report'

/* After receiving a GET request, redirect to the homepage if the user has not
   login. Otherwise, run `py/users.py` with the email of the login user to
   obtain a html drop down list consisting of all user emails in the database
   except the login user. Finally, render the page with that drop down
   list.  */
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
