// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const User = require('./models/usermodels');
// const connectDB = require('./db');  // ✅ Already importing from `db.js`

// const app = express();
// const PORT = process.env.PORT || 3001;
// const MONGO_URI = process.env.MONGO_URI;

// // Check if MONGO_URI is provided
// if (!MONGO_URI) {
//   console.error('❌ MongoDB URI is missing! Check your .env file.');
//   process.exit(1);
// }

// // ✅ Use the imported `connectDB` function instead of redefining it
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Test Route
// app.get('/', (req, res) => {
//   res.send("Backend is running!");
// });

// // Signup Route
// app.post('/signup', async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       phoneNumber,
//       aadharNumber,
//       isDriver,
//       drivingLicenceNumber,
//       vehicleNumber
//     } = req.body;

//     // Validation
//     if (!firstName || !lastName || !email || !password || !phoneNumber || !aadharNumber) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     // Create new user
//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       password,
//       phoneNumber,
//       aadharNumber,
//       isDriver,
//       drivingLicenceNumber: isDriver ? drivingLicenceNumber : null,
//       vehicleNumber: isDriver ? vehicleNumber : null
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     console.error('Error signing up:', error.message);
//     res.status(500).json({ error: 'Error creating user' });
//   }
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const User = require('./models/usermodels');
const Driver = require('./models/drivermodels');

app.post('/signup', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      aadharNumber,
      isDriver,
      drivingLicenceNumber,
      vehicleNumber,
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !phoneNumber || !aadharNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email exists in User or Driver collections
    const userExists = await User.findOne({ email });
    const driverExists = await Driver.findOne({ email });
    if (userExists || driverExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    if (isDriver) {
      // Create a new Driver
      const newDriver = new Driver({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        aadharNumber,
        drivingLicenceNumber,
        vehicleNumber,
      });
      await newDriver.save();
      return res.status(201).json({ message: 'Driver created successfully' });
    } else {
      // Create a new User
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        aadharNumber,
      });
      await newUser.save();
      return res.status(201).json({ message: 'User created successfully' });
    }
  } catch (error) {
    console.error('Error signing up:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

