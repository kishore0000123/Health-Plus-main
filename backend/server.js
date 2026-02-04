const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendAppointmentConfirmation, sendAppointmentReminder } = require('./emailService');
const authMiddleware = require('./authMiddleware');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthplus';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'patient',
    enum: ['patient', 'doctor', 'admin']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
    minlength: 8
  },
  patientNumber: {
    type: String,
    required: true,
    length: 10
  },
  patientEmail: {
    type: String,
    required: false
  },
  patientGender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'private']
  },
  appointmentTime: {
    type: Date,
    required: true
  },
  preferredMode: {
    type: String,
    required: true,
    enum: ['voice', 'video']
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'cancelled', 'completed']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Authentication Routes

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || name.length < 3) {
      return res.status(400).json({ success: false, message: 'Name must be at least 3 characters' });
    }

    if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
  }
});

// Get current user (protected route)
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
  }
});

// Routes

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching appointments', error: error.message });
  }
});

// Get single appointment by ID
app.get('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching appointment', error: error.message });
  }
});

// Create new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { patientName, patientNumber, patientEmail, patientGender, appointmentTime, preferredMode } = req.body;

    // Validation
    if (!patientName || patientName.length < 8) {
      return res.status(400).json({ success: false, message: 'Patient name must be at least 8 characters' });
    }

    if (!patientNumber || patientNumber.length !== 10) {
      return res.status(400).json({ success: false, message: 'Patient phone number must be 10 digits' });
    }

    if (!patientGender || !['male', 'female', 'private'].includes(patientGender)) {
      return res.status(400).json({ success: false, message: 'Invalid patient gender' });
    }

    if (!appointmentTime || new Date(appointmentTime) <= new Date()) {
      return res.status(400).json({ success: false, message: 'Appointment time must be in the future' });
    }

    if (!preferredMode || !['voice', 'video'].includes(preferredMode)) {
      return res.status(400).json({ success: false, message: 'Invalid preferred mode' });
    }

    // Create appointment
    const appointment = new Appointment({
      patientName,
      patientNumber,
      patientEmail,
      patientGender,
      appointmentTime,
      preferredMode
    });

    await appointment.save();

    // Send confirmation email if email is provided
    if (patientEmail) {
      const emailResult = await sendAppointmentConfirmation({
        patientName,
        patientEmail,
        patientNumber,
        appointmentTime,
        preferredMode
      });

      if (!emailResult.success) {
        console.warn('⚠️ Failed to send confirmation email:', emailResult.error);
      }
    }

    res.status(201).json({ 
      success: true, 
      message: 'Appointment created successfully',
      data: appointment,
      emailSent: patientEmail ? true : false
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating appointment', error: error.message });
  }
});

// Update appointment status
app.patch('/api/appointments/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, message: 'Appointment updated successfully', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating appointment', error: error.message });
  }
});

// Delete appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting appointment', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
