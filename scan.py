from datetime import datetime
from interval import interval
from pymongo import MongoClient
from sys import argv
from time import mktime
from itertools import chain, groupby

union = interval.union
concat = chain.from_iterable

client = MongoClient()
db = client['csci3100PickUp']
scheds = db['schedules']
users = db['users']

def parse_time(s):
    return mktime(datetime.strptime(s, '%B %d, %Y %H:%M:%S').timetuple())

def email_to_oid(email):
    return users.find_one({'email': email})['_id']

def oid_to_name_email(oid):
    auth = users.find_one({'_id': oid})
    return auth['username'], auth['email']

def sched_itv(sched):
    return interval([parse_time(sched['startDate']),
                     parse_time(sched['endDate'])])

def normalize_sched(sched):
    oid = sched['owner']
    name, email = oid_to_name_email(oid)
    act = sched['content']
    itv = sched_itv(sched)
    return {'username': name, 'email': email, 'activity': act, 'interval': itv}

def normalize_scheds(scheds):
    return [normalize_sched(sched) for sched in scheds]

def filter_keys(dic, keys):
    return {k: dic[k] for k in dic if k not in keys}

def sched_ls_to_dict(scheds):
    sched_act = lambda sched: sched['activity']
    sorted_scheds = sorted(scheds, key=sched_act)
    return {act: [filter_keys(sched, {'activity'}) for sched in grp]
            for act, grp in groupby(sorted_scheds, sched_act)}

my_oid = email_to_oid('john@example.com') #argv[1]

my_scheds = normalize_scheds(scheds.find({'owner': my_oid}))

my_acts = {sched['activity'] for sched in my_scheds}

my_scheds_2 = sched_ls_to_dict(my_scheds)

other_scheds = concat(scheds.find({'content': act}) for act in my_acts)

other_scheds_2 = normalize_scheds(sched
                                  for sched in other_scheds
                                  if sched['owner'] != my_oid)

#other_scheds_3 = [sched
#                  for sched in other_scheds_2 if match_time()]

#other_scehds_3 = (sched
#                  for sched in other_scheds_2
#                  if sched['owner'] != my_oid)

#other_scheds_2 = [sched for sched in other_scheds
#                  if my_scheds_2[sched['activity']]]

#other_scheds = concat(filter(lambda sched: sched_time(sched) & my_scheds_2[act],
#                             ))
#                      for act in my_acts)
#other_scheds_2 = scheds_to_tups(other_scheds)

# TODO: generate table dynamically

print('''
<table class="table">
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Activity</th>
      <th scope="col">Name</th>
      <th scope="col">Matching time slot</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>
        <img class="img-fluid"
             src="../icons/whois-icon.png"
             style="max-width: 50%;">
      </th>
      <td>Football</td>
      <td>John</td>
      <td>10:30 am - 11:30 am</td>
      <td>
        <button class="btn btn-success"
                type="button">
          CONFIRM
        </button>
      </td>
    </tr>
    <tr>
      <th>
        <img class="img-fluid"
             src="../icons/whois-icon.png"
             style="max-width: 50%;">
      </th>
      <td>Basketball</td>
      <td>Marry</td>
      <td>2:30 pm - 3:30 pm</td>
      <td>
        <button class="btn btn-success"
                type="button">
          CONFIRM
        </button>
      </td>
    </tr>
    <tr>
      <th>
        <img class="img-fluid"
             src="../icons/whois-icon.png"
             style="max-width: 50%;">
      </th>
      <td>Badminton</td>
      <td>Peter</td>
      <td>7:30 pm - 8:30 pm</td>
      <td>
        <button class="btn btn-success" type="button">
          CONFIRM
        </button>
      </td>
    </tr>
  </tbody>
</table>'''.replace('\n', ' '))
