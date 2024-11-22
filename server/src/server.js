const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db/database');

// Import routes
const patientsRouter = require('./routes/patients');
const doctorsRouter = require('./routes/doctors');
const appointmentsRouter = require('./routes/appointments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/patients', patientsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);

// auth routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});