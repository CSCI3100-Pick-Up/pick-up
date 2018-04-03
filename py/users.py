# Pick-up --- Web application to connect students
# Copyright © 2018 Alex Vong <alexvong1995@gmail.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

from html import escape
from pymongo import MongoClient
from sys import argv

join = str.join

client = MongoClient()
db = client['csci3100PickUp']
users = db['users']

def format_email(email):
    fmt = '<option value="{email}">{email}</option>'
    return fmt.format(email=escape(email))

def format_emails(emails):
    fmt = '<datalist id="userDropdown">{emails}</datalist>'
    html = fmt.format(emails=join('', [format_email(email)
                                       for email in emails]))
    return html.replace('\n', ' ')

my_email = argv[-1]
auths = users.find()
other_emails = [auth['email']
                for auth in auths
                if auth['email'] not in {my_email, 'admin'}]

print(format_emails(sorted(other_emails)))
