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

'''
Format all user emails in the database as a html drop down list except the
one given in `argv[-1]`.
'''

from html import escape
from pymongo import MongoClient
from sys import argv

# Aliases for functions.
join = str.join

def format_email(email):
    'Format user email `email` as an item of a html drop down list.'
    fmt = '<option value="{email}">{email}</option>'
    return fmt.format(email=escape(email))

def format_emails(emails):
    'Format a list of user emails `emails` as a html drop down list.'
    fmt = '<datalist id="userDropdown">{emails}</datalist>'
    html = fmt.format(emails=join('', [format_email(email)
                                       for email in emails]))
    return html.replace('\n', ' ')

# Entry point.
if __name__ == '__main__':
    client = MongoClient()
    db = client['csci3100PickUp']
    users = db['users']

    my_email = argv[-1]
    auths = users.find()
    other_emails = [auth['email']
                    for auth in auths
                    if auth['email'] not in {my_email, 'admin'}]

    print(format_emails(sorted(other_emails)))
