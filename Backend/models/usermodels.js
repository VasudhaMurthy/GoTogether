// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: { type: String, unique: true },
//   password: String,
//   phoneNumber: String,
//   aadharNumber: String
// });

// const User = mongoose.model('Passenger', userSchema);
// module.exports = User;


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  phoneNumber: String,
  aadharNumber: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
