var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcryptjs');


var UserSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});


var ScheduleSchema = Schema({
  owner: { type: ObjectId, ref: 'User' },
  content: { type: String, default: '' },
  endDate: { type: String, default: Date.now.toString() },
  startDate: { type: String, default: Date.now.toString() }
});

var BlacklistSchema = Schema({
  blacklisteduser: {type: String, required: true, dropDups: true},
  byuser: {type: String, required: true},
  didnotshowup: {type: Boolean, required: true},
  badbehavior: {type: Boolean, required: true},
  detail: {type: String}
});

var User = mongoose.model('User', UserSchema);
var Schedule = mongoose.model('Schedule', ScheduleSchema);
var Blacklist = mongoose.model('Blacklist', BlacklistSchema);

// Place holder for authentication
async function authenticate(email, password) {
  return await User.findOne({email: email}).exec().then(function(user){
      return bcrypt.compareSync(password,user.password);
  });
  //return (username === 'john' && password === '123');
}

function errHandler(err, res) {
    console.log(err);
    res.status(500).send('Error!');
};

module.exports = {
  User: User,
  Schedule: Schedule,
  Blacklist: Blacklist,
  authenticate: authenticate,
  errHandler: errHandler,
}
