from datetime import datetime
from interval import interval
from pymongo import MongoClient
from sys import argv
from time import mktime

def str_to_time(s):
    return mktime(datetime.strptime(s, '%B %d, %Y %H:%M:%S').timetuple())

union = interval.union

client = MongoClient()
db = client['csci3100PickUp']
scheds = db['schedules']
users = db['users']

my_email = 'john@example.com' #argv[1]
my_oid = users.find_one({'email': my_email})['_id']

all_my_scheds = scheds.find({'owner': my_oid})
my_scheds = [(sched['content'],
              interval([str_to_time(sched['startDate']),
                        str_to_time(sched['endDate'])]))
             for sched in all_my_scheds]
my_acts = {act for (act, _) in my_scheds}
my_scheds_2 = {act: union((t for (_, t) in filter(lambda sched: sched[0] == act,
                                                  my_scheds)))
               for act in my_acts}

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
