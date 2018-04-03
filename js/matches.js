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

const title = 'PickUp - Scan Result'
app.get('/matches',

        (req, res) =>
        {if (!req.session.user)
         res.redirect('/')
         else py.run('py/scan.py',
                     {args: [req.session.user]},

                     (err, table) =>
                     {if (err)
                      console.log(err)
                      else res.render('matches.ejs', {title: title,
                                                      table: table})})})
