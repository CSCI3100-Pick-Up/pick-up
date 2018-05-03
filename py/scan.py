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
Given user email `argv[-1]`, compute all overlapping time intervals of that
user with other users for each activity, and print the result as a html
table.
'''

from datetime import datetime
from html import escape
from itertools import chain, groupby
from pymongo import MongoClient
from sys import argv
from time import mktime

# Aliases for functions.
concat = chain.from_iterable
join = str.join
fromtimestamp = datetime.fromtimestamp

def delete_key(key, dic):
    'Delete key `key` from dictionary `dic`.'
    return {k: dic[k] for k in dic if k != key}

def safe_escape(x):
    'Escape `x` if possible, otherwise just return it.'
    try:
        return escape(x)
    except:
        return x

def open_itv(a, b):
    'Create the open interval (`a`, `b`).'
    if a < b:
        return (a, b)
    else:
        return {}

def intersect(j1, j2):
    'Given two intervals `j1` and `j2`, return their intersection.'
    if not j1 or not j2:
        return {}
    else:
        (a1, b1) = j1
        (a2, b2) = j2
        a = max(a1, a2)
        b = min(b1, b2)
        return open_itv(a, b)

def email_to_oid(email):
    'Given email `email` of a user, return the oid of that user.'
    auth = users.find_one({'email': email})
    return auth['_id']

def oid_to_name_email_image(oid):
    '''Given oid `oid` of a user, return the name, email and image of that
    user.'''
    auth = users.find_one({'_id': oid})
    return auth['username'], auth['email'], auth['image']

def sched_itv(sched):
    '''Given an unnormalized schedule dictionary `sched`, create an open
    interval from the start date to the end date of that schedule.'''
    return open_itv(sched['startDate'], sched['endDate'])

def normalize_sched(sched):
    'Normalize schedule dictionary `sched` taken from the database.'
    oid = sched['owner']
    name, email, image = oid_to_name_email_image(oid)
    act = sched['content']
    itv = sched_itv(sched)
    return {'username': name,
            'image': image,
            'email': email,
            'activity': act,
            'interval': itv}

def normalize_scheds(scheds):
    '''Normalize a list of schedule dictionaries `scheds` taken from the
    database.'''
    return [normalize_sched(sched) for sched in scheds]

def scheds_to_dict(scheds):
    '''Convert a list of schedule dictionaries `scheds` to an activity-indexed
    dictionary.'''
    sched_act = lambda sched: sched['activity']
    sorted_scheds = sorted(scheds, key=sched_act)
    return {act: [sched for sched in grp]
            for act, grp in groupby(sorted_scheds, sched_act)}

def intersect_scheds(scheds, itvs):
    '''Given value `scheds` of an activity-indexed dictionary, compute all
    overlaps of time interval `scheds['interval']` and the list of time
    interval `itvs`.'''
    return ({'interval': intersect(sched['interval'], itv),
             **delete_key('interval', sched)}
            for sched in scheds
            for itv in itvs)

def normalize_html(html):
    'Escape all spaces and new lines of html `html`.'
    return html.replace(' ', '&nbsp;').replace('\n', '<br>')

def format_time(time):
    'Convert unix time `time` into human-readable format.'
    fmt = normalize_html('%B %d, %Y %H:%M:%S')
    return fromtimestamp(time / 10 ** 3).strftime(fmt)

def format_itv(itv):
    'Convert time interval `itv` into human-readable format.'
    a, b = itv
    fmt = '''from  {start}
until  {end}'''
    return normalize_html(fmt).format(start=format_time(a), end=format_time(b))

def format_match(match):
    'Format match dictionary `match` as a row of a html table.'
    return '''
<tr>
  <th>
    <img class="img-fluid"
         src="{image}"
         style="max-width: 50%;">
  </th>
  <td>{activity}</td>
  <td>{username}</td>
  <td>{interval}</td>
  <td>
    <form action="/chatroom" method="post">
      <button class="btn btn-success"
              name="email"
              value="{email}">
        CONFIRM
      </button>
    </form>
  </td>
</tr>
'''.format(activity=match['activity'],
           username=match['username'],
           interval=format_itv(match['interval']),
           email=match['email'],
           image=match['image'])

def format_matches(matches):
    '''Format a list of match dictionaries `matches` as the body of a html
    table.'''
    fmt = '<tbody>{matches}</tbody>'
    return fmt.format(matches=join('', [format_match(match)
                                        for match in matches]))

def format_field(field):
    'Format field `field` as a header item of a html table.'
    fmt = '<th scope="col">{field}</th>'
    return fmt.format(field=normalize_html(field))

def format_feilds(fields):
    'Format a list of fields `fields` as a header of a html table.'
    fmt = '<thead><tr>{fields}</tr></thead>'
    return fmt.format(fields=join('', [format_field(field)
                                       for field in fields]))

def escape_match(match):
    'Escape all values of match dictionary `match`.'
    return {k: safe_escape(match[k]) for k in match}

def escape_matches(matches):
    'Escape all values in a list of match dictionaries `matches`.'
    return [escape_match(match) for match in matches]

def format_html(matches):
    'Format a list of match dictionaries `matches` as a html table.'
    fields = ['', 'Activity', 'Name', 'Matching time slot']
    text = '' if matches else 'No matches found.'
    html = '''
<table class="table">
  {fields}
  {matches}
</table>
{text}
'''.format(fields=format_feilds(fields),
           matches=format_matches(escape_matches(matches)),
           text=normalize_html(text))
    return html.replace('\n', ' ')

# Entry point.
if __name__ == '__main__':
    client = MongoClient()
    db = client['csci3100PickUp']
    scheds = db['schedules']
    users = db['users']

    my_email = argv[-1]
    my_sched_ls = normalize_scheds(scheds.find({'owner':
                                                email_to_oid(my_email)}))
    my_sched_dict = scheds_to_dict(my_sched_ls)

    other_sched_ls = normalize_scheds(concat(scheds.find({'content': act})
                                             for act in my_sched_dict))
    other_sched_dict = scheds_to_dict(other_sched_ls)

    overlaps = concat(intersect_scheds(other_sched_dict[act],
                                       [sched['interval']
                                        for sched in my_sched_dict[act]])
                      for act in my_sched_dict)
    matches = [sched
               for sched in overlaps
               if sched['interval'] and sched['email'] != my_email]

    print(format_html(matches))
