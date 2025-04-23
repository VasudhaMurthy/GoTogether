import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Background from "../Assets/profile-background.jpg";
import './signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    aadharNumber: '',
    isDriver: false,
    drivingLicenceNumber: '',
    vehicleNumber: ''
  });
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      try {
        const response = await axios.post('http://localhost:3001/signup', formData);
        alert(response.data.message);
        navigate('/login');
      } catch (error) {
        setError(error.response?.data?.error || 'Signup failed. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div style={{ backgroundImage: `url(${Background})`, height: '100vh', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="signup-container">
        <form onSubmit={handleSignup} className="signup-form">
          <h2>Sign Up</h2>
          {step === 1 && (
            <div>
              <div className="form-group">
                <label>First Name:</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <button type="submit">Next</button>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="form-group">
                <label>Phone Number:</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Aadhar Number:</label>
                <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="checkbox" name="isDriver" checked={formData.isDriver} onChange={handleChange} id="isDriverCheckbox" />
                <label htmlFor="isDriverCheckbox">I want to register as a driver</label>
              </div>
              {formData.isDriver && (
                <>
                  <div className="form-group">
                    <label>Driving Licence Number:</label>
                    <input type="text" name="drivingLicenceNumber" value={formData.drivingLicenceNumber} onChange={handleChange} required={formData.isDriver} />
                  </div>
                  <div className="form-group">
                    <label>Vehicle Number:</label>
                    <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required={formData.isDriver} />
                  </div>
                </>
              )}
              <button type="button" onClick={() => setStep(1)}>Back</button>
              <button type="submit">Complete Registration</button>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <div className="login-link">
            Already have an account? <a href="/login">Login here</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
