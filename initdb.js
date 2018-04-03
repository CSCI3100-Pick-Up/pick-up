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

      model.Blacklist.remove({}, function(err) {
        if(err)
          return console.log(err);

    // Populate data only after both collections are cleared.
      populateData();
    });
  });
});

// ----------------------------------------------------------------------


function populateData() {
  //var t = [ 'yummy', 'delicious', 'yuk', 'pretty', 'funny',
            //'pricy', 'meh', 'interesting', 'omg', 'bravo' ];

  var schedules = [
    _schedule(0, 'Study', new Date("April 4, 2018 16:00:00").getTime(), new Date("April 4, 2018 13:00:00").getTime()),
    _schedule(1, 'Basketball', new Date("April 4, 2018 15:00:00").getTime(), new Date("April 4, 2018 11:00:00").getTime()),
    _schedule(2, 'Soccer', new Date("April 4, 2018 16:00:00").getTime(), new Date("April 4, 2018 14:00:00").getTime()),
    _schedule(3, 'Tennis', new Date("April 4, 2018 21:00:00").getTime(), new Date("April 4, 2018 17:00:00").getTime()),
    _schedule(0, 'Table Tennis', new Date("April 4, 2018 17:00:00").getTime(), new Date("April 4, 2018 13:00:00").getTime()),
    _schedule(2, 'Midterms', new Date("April 4, 2018 15:00:00").getTime(), new Date("April 4, 2018 11:00:00").getTime()),
    _schedule(4, 'Lecture', new Date("April 4, 2018 15:00:00").getTime(), new Date("April 4, 2018 11:00:00").getTime()),
    _schedule(5, 'Exam', new Date("April 4, 2018 15:00:00").getTime(), new Date("April 4, 2018 11:00:00").getTime()),
    _schedule(5, 'Tutorial', new Date("April 4, 2018 10:00:00").getTime(), new Date("April 4, 2018 09:00:00").getTime()),
    _schedule(10, 'Basketball', new Date("April 4, 2018 15:00:00").getTime(), new Date("April 4, 2018 10:00:00").getTime()),
    _schedule(8, 'Piano', new Date("April 4, 2018 11:00:00").getTime(), new Date("April 4, 2018 10:00:00").getTime()),
    _schedule(4, 'Study', new Date("April 4, 2018 11:00:00").getTime(), new Date("April 4, 2018 09:00:00").getTime()),
    _schedule(8, 'Lecture', new Date("April 4, 2018 16:00:00").getTime(), new Date("April 4, 2018 13:00:00").getTime()),
    _schedule(7, 'Basketball', new Date("April 4, 2018 16:00:00").getTime(), new Date("April 4, 2018 13:00:00").getTime()),
    _schedule(1, 'Soccer', new Date("April 4, 2018 15:00:00").getTime(), new Date("April 4, 2018 13:00:00").getTime()),
    _schedule(0, 'Tennis', new Date("April 2, 2018 12:00:00").getTime(), new Date("April 2, 2018 10:00:00").getTime()),
    _schedule(1, 'Tennis', new Date("April 2, 2018 12:00:00").getTime(), new Date("April 2, 2018 11:00:00").getTime()),
    _schedule(2, 'Tennis', new Date("April 2, 2018 11:00:00").getTime(), new Date("April 2, 2018 10:00:00").getTime()),
    _schedule(3, 'Tennis', new Date("April 2, 2018 12:00:00").getTime(), new Date("April 2, 2018 10:00:00").getTime()),
    _schedule(4, 'Tennis', new Date("April 2, 2018 14:00:00").getTime(), new Date("April 2, 2018 12:00:00").getTime())
  ];

  // 11 users
  var users = [
    _user('john', 'john@cuhk.edu.hk', '123', '/img/default.png'),
    _user('jane', 'jane@cuhk.edu.hk', '123', '/img/default.png'),
    _user('eric', 'eric@cuhk.edu.hk', '123', '/img/default.png'),
    _user('matt', 'matt@cuhk.edu.hk', '123', '/img/default.png'),
    _user('jill', 'jill@cuhk.edu.hk', '123', '/img/default.png'),
    _user('bill', 'bill@cuhk.edu.hk', '123', '/img/default.png'),
    _user('bob', 'bob@cuhk.edu.hk', '123', '/img/default.png'),
    _user('charles', 'charles@cuhk.edu.hk', '123', '/img/default.png'),
    _user('susan', 'susan@cuhk.edu.hk', '123', '/img/default.png'),
    _user('tanya', 'tanya@cuhk.edu.hk', '123', '/img/default.png'),
    _user('fred', 'fred@cuhk.edu.hk', '123', '/img/default.png'),
    _user('admin', 'admin', '123', '/img/default.png')
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

function _user(username, email, password, image,  schedules) {
  return {
    username: username,
    email: email,
    password: password,
    image: image,
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
