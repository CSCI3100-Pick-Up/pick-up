from datetime import datetime
from html import escape
from itertools import chain, groupby
from pymongo import MongoClient
from sys import argv
from time import mktime

concat = chain.from_iterable
join = str.join
strptime = datetime.strptime
fromtimestamp = datetime.fromtimestamp

def delete_key(key, dic):
    return {k: dic[k] for k in dic if k != key}

def open_itv(a, b):
    if a < b:
        return (a, b)
    else:
        return {}

def intersect(j1, j2):
    if not j1 or not j2:
        return {}
    else:
        (a1, b1) = j1
        (a2, b2) = j2
        a = max(a1, a2)
        b = min(b1, b2)
        return open_itv(a, b)

client = MongoClient()
db = client['csci3100PickUp']
scheds = db['schedules']
users = db['users']

def parse_time(s):
    return mktime(strptime(s, '%B %d, %Y %H:%M:%S').timetuple())

def email_to_oid(email):
    auth = users.find_one({'email': email})
    return auth['_id']

def oid_to_name_email(oid):
    auth = users.find_one({'_id': oid})
    return auth['username'], auth['email']

def sched_itv(sched):
    return open_itv(parse_time(sched['startDate']),
                    parse_time(sched['endDate']))

def normalize_sched(sched):
    oid = sched['owner']
    name, email = oid_to_name_email(oid)
    act = sched['content']
    itv = sched_itv(sched)
    return {'username': name, 'email': email, 'activity': act, 'interval': itv}

def normalize_scheds(scheds):
    return [normalize_sched(sched) for sched in scheds]

def scheds_to_dict(scheds):
    sched_act = lambda sched: sched['activity']
    sorted_scheds = sorted(scheds, key=sched_act)
    return {act: [sched for sched in grp]
            for act, grp in groupby(sorted_scheds, sched_act)}

def intersect_scheds(scheds, itvs):
    return ({'interval': intersect(sched['interval'], itv),
             **delete_key('interval', sched)}
            for sched in scheds
            for itv in itvs)

def normalize_html(html):
    return escape(html.replace(' ', '&nbsp;').replace('\n', '<br>'))

def format_time(time):
    fmt = '%B %d, %Y %H:%M:%S'
    return normalize_html(fromtimestamp(time).strftime(fmt))

def format_itv(itv):
    a, b = itv
    fmt = '''from  {start}
until  {end}'''
    return normalize_html(fmt.format(start=format_time(a), end=format_time(b)))

def format_match(match):
    return '''
<tr>
  <th>
    <img class="img-fluid"
         src={image}
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
           image='"../icons/whois-icon.png"')

def format_matches(matches):
    return '<tbody>' + join('', [format_match(match)
                                 for match in matches]) + '</tbody>'

def format_field(field):
    return '<th scope="col">{field}</th>'.format(field=normalize_html(field))

def format_feilds(fields):
    return '<thead><tr>' + join('', [format_field(field)
                                     for field in fields]) + '</tr></thead>'

def format_html(matches):
    fields = ['', 'Activity', 'Name', 'Matching time slot']
    text = '' if matches else 'No matches found.'
    html = '''
<table class="table">
  {fields}
  {matches}
</table>
{text}
'''.format(fields=format_feilds(fields),
           matches=format_matches(matches),
           text=normalize_html(text))
    return html.replace('\n', ' ')

my_email = argv[-1]
my_sched_ls = normalize_scheds(scheds.find({'owner': email_to_oid(my_email)}))
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
