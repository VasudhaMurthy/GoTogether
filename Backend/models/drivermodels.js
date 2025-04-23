// const mongoose = require('mongoose');

// const driverSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: { type: String, unique: true },
//   password: String,
//   phoneNumber: String,
//   aadharNumber: String,
//   drivingLicenceNumber: String,
//   vehicleNumber: String
// });

// const Driver = mongoose.model('Driver', driverSchema);
// module.exports = Driver;


const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  phoneNumber: String,
  aadharNumber: String,
  drivingLicenceNumber: String,
  vehicleNumber: String,
});

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
