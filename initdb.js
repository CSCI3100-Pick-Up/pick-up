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
    _schedule(0, 'Study', "March 20, 2018 19:00:00", "March 20, 2018 17:00:00"),
    _schedule(1, 'Basketball', "March 20, 2018 19:00:00", "March 20, 2018 17:00:00"),
    _schedule(2, 'Soccer', "March 20, 2018 19:00:00", "March 20, 2018 17:00:00"),
    _schedule(3, 'Tennis', "March 20, 2018 21:00:00", "March 20, 2018 17:00:00"),
    _schedule(0, 'Table Tennis', "March 22, 2018 17:00:00", "March 22, 2018 13:00:00"),
    _schedule(2, 'Midterms', "March 21, 2018 15:00:00", "March 21, 2018 11:00:00"),
    _schedule(4, 'Lecture', "March 20, 2018 15:00:00", "March 20, 2018 11:00:00"),
    _schedule(5, 'Exam', "March 20, 2018 15:00:00", "March 20, 2018 11:00:00"),
    _schedule(5, 'Tutorial', "March 20, 2018 10:00:00", "March 20, 2018 09:00:00"),
    _schedule(10, 'Basketball', "March 20, 2018 11:00:00", "March 20, 2018 10:00:00"),
    _schedule(8, 'Piano', "March 20, 2018 11:00:00", "March 20, 2018 10:00:00"),
    _schedule(4, 'Study', "March 29, 2018 11:00:00", "March 29, 2018 09:00:00"),
    _schedule(8, 'Lecture', "March 30, 2018 12:00:00", "March 30, 2018 11:00:00"),
    _schedule(7, 'Basketball', "March 31, 2018 13:00:00", "March 31, 2018 10:00:00"),
    _schedule(1, 'Soccer', "March 31, 2018 14:00:00", "March 31, 2018 12:00:00"),
    _schedule(1, 'Tennis', "April 2, 2018 12:00:00", "April 2, 2018 10:00:00")
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
