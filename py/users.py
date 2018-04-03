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
