var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var UserSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});


var ScheduleSchema = Schema({
  owner: { type: ObjectId, ref: 'User' },
  content: { type: String, default: '' },
  endDate: { type: Date, default: Date.now },
  startDate: { type: Date, default: Date.now }
});


var User = mongoose.model('User', UserSchema);
var Schedule = mongoose.model('Schedule', ScheduleSchema);


// Place holder for authentication
function authenticate(username, password) {
  return (username === 'john' && password === '123');
}

module.exports = {
  User: User,
  Schedule: Schedule,
  authenticate: authenticate,
}
