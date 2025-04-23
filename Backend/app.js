
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Models
const User = require('./models/usermodels');
const Driver = require('./models/drivermodels');

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Signup route with password hashing
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

    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (isDriver) {
      // Create a new Driver
      const newDriver = new Driver({
        firstName,
        lastName,
        email,
        password: hashedPassword,
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
        password: hashedPassword,
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

// Login route to authenticate and return JWT
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user in User or Driver collection
    let user = await User.findOne({ email });
    if (!user) {
      user = await Driver.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    // Create JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      isDriver: user.drivingLicenceNumber ? true : false,
    };

    // Sign token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

