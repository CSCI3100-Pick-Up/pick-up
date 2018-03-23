// This file contains code to repopulate the DB with test data

var mongoose = require('mongoose');

require('./js/db.js'); // Set up connection and create DB if it does not exists yet

var model = require('./js/model.js');
var bcrypt = require('bcryptjs');
// Remove existing data from Users and Items collections and
// repopulate them with test data
model.User.remove({}, function(err) {
  if (err)
    return console.log(err);

  model.Schedule.remove({}, function(err) {
    if (err)
      return console.log(err);

    // Populate data only after both collections are cleared.
    populateData();
  });
});

// ----------------------------------------------------------------------


function populateData() {
  //var t = [ 'yummy', 'delicious', 'yuk', 'pretty', 'funny',
            //'pricy', 'meh', 'interesting', 'omg', 'bravo' ];

  var schedules = [
    _schedule(0, 'Study', new Date(2018, 3, 20, 13), new Date(2018, 3, 20, 3)),
    _schedule(1, 'Basketball', new Date(2018, 3, 19, 17), new Date(2018, 3, 19, 7)),
    _schedule(2, 'Soccer', new Date(2018, 4, 12, 4), new Date(2018, 4, 12, 2)),
    _schedule(3, 'Tennis', new Date(2018, 3, 13, 20), new Date(2018, 3, 13, 15)),
    _schedule(0, 'Table Tennis', new Date(2018, 3, 30, 11), new Date(2018, 3, 30, 2)),
    _schedule(2, 'Midterms', new Date(2018, 2, 20, 15), new Date(2018, 2, 20, 7)),
    _schedule(4, 'Lecture', new Date(2018, 1, 15, 3), new Date(2018, 1, 15, 0)),
    _schedule(5, 'Exam', new Date(2018, 3, 19, 17), new Date(2018, 3, 19, 10)),
    _schedule(5, 'Tutorial', new Date(2018, 3, 20, 13), new Date(2018, 3, 20, 11)),
    _schedule(10, 'Basketball', new Date(2018, 3, 10, 9), new Date(2018, 3, 10, 7)),
    _schedule(8, 'Piano', new Date(2018, 3, 20, 15), new Date(2018, 3, 20, 10)),
    _schedule(4, 'Study', new Date(2018, 3, 21, 6), new Date(2018, 3, 21, 2)),
    _schedule(8, 'Lecture', new Date(2018, 3, 11, 11), new Date(2018, 3, 11, 10)),
    _schedule(7, 'Basketball', new Date(2018, 3, 12, 12), new Date(2018, 3, 12, 2)),
    _schedule(1, 'Soccer', new Date(2018, 3, 10, 8), new Date(2018, 3, 10, 6)),
    _schedule(1, 'Tennis', new Date(2018, 3, 12, 9), new Date(2018, 3, 12, 7))
  ];

  // 11 users
  var users = [
    _user('john', 'john@example.com', '123'),
    _user('jane', 'jane@yahoo.com', '123'),
    _user('eric', 'eric@gmail.com', '123'),
    _user('matt', 'matt@gmail.com', '123'),
    _user('jill', 'jill@yahoo.com', '123'),
    _user('bill', 'bill@gmail.com', '123'),
    _user('bob', 'bob@hotmail.com', '123'),
    _user('charles', 'charles@hotmail.com', '123'),
    _user('susan', 'susan@gmail.com', '123'),
    _user('tanya', 'tanya@foo.com', '123'),
    _user('fred', 'fred@bar.com', '123')
  ];
  for (var i=0;i<users.length;i++) {
    var hash = bcrypt.hashSync(users[i].password, 10);
    users[i].password = hash;
  }

  // Insert all users at once
  model.User.create(users, function(err, _users) {
    if (err) handleError(err);

    // _users are now saved to DB and have _id

    // Replace the owner indexes by their _ids
    for (var i = 0; i < schedules.length; i++) {
      var ownerIdx = schedules[i].owner;
      schedules[i].owner = _users[ownerIdx]._id;
    }

    // Insert all items
    model.Schedule.create(schedules, function(err, _schedules) {
      if (err) handleError(err);

      // Success
      console.log(_users);
      console.log(_schedules);
      mongoose.connection.close();
    });
  });
}

function _user(username, email, password, schedules) {
  return {
    username: username,
    email: email,
    password: password,
    schedules: schedules
  };
}

function _schedule(ownerIdx, content, endDate, startDate) {
  return {
    owner: ownerIdx,
    content: content,
    endDate: endDate,
    startDate: startDate
  };
}

function handleError(err) {
  console.log(err);
  mongoose.connection.close();
}
