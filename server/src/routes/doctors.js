const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Get all doctors
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM doctors ORDER BY last_name');
        console.log('Fetched doctors:', rows); // Debug log
        res.json(rows);
    } catch (err) {
        console.error('Error fetching doctors:', err); // Debug log
        res.status(500).json({ error: err.message });
    }
});

// Add new doctor
router.post('/', async (req, res) => {
    const { firstName, lastName, specialization, email, phone, qualification, experience } = req.body;
    
    try {
        // Log the incoming data
        console.log('Creating doctor with data:', {
            firstName, lastName, specialization, email, phone, qualification, experience
        });

        // Validate required fields
        if (!firstName || !lastName || !specialization || !email || !phone) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['firstName', 'lastName', 'specialization', 'email', 'phone']
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if email already exists
        const [existingDoctors] = await pool.query('SELECT * FROM doctors WHERE email = ?', [email]);
        if (existingDoctors.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Insert the new doctor
        const [result] = await pool.query(
            `INSERT INTO doctors (
                first_name, 
                last_name, 
                specialization, 
                email, 
                phone, 
                qualification, 
                experience
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, specialization, email, phone, qualification, experience]
        );

        // Fetch and return the newly created doctor
        const [newDoctor] = await pool.query(
            'SELECT * FROM doctors WHERE doctor_id = ?', 
            [result.insertId]
        );

        console.log('Created new doctor:', newDoctor[0]); // Debug log
        res.status(201).json(newDoctor[0]);
    } catch (err) {
        console.error('Error creating doctor:', err); // Debug log
        // Send more specific error messages
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Email already exists' });
        } else if (err.code === 'ER_NO_REFERENCED_ROW') {
            res.status(400).json({ error: 'Invalid reference in data' });
        } else {
            res.status(500).json({ 
                error: 'Failed to create doctor',
                details: err.message,
                code: err.code
            });
        }
    }
});

// Update Doctor
router.put('/:id', async (req, res) => {
    const { firstName, lastName, specialization, email, phone, qualification, experience } = req.body;
    try {
        await pool.query(
            'UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, email = ?, phone = ?, qualification = ?, experience = ? WHERE doctor_id = ?',
            [firstName, lastName, specialization, email, phone, qualification, experience, req.params.id]
        );
        const [updatedDoctor] = await pool.query('SELECT * FROM doctors WHERE doctor_id = ?', [req.params.id]);
        res.json(updatedDoctor[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Doctor
router.delete('/:id', async (req, res) => {
    try {
        // Check if doctor has appointments
        const [appointments] = await pool.query(
            'SELECT * FROM appointments WHERE doctor_id = ?',
            [req.params.id]
        );
        
        if (appointments.length > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete doctor with existing appointments. Reassign or cancel appointments first.' 
            });
        }

        await pool.query('DELETE FROM doctors WHERE doctor_id = ?', [req.params.id]);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single doctor
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM doctors WHERE doctor_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get doctor's appointments
router.get('/:id/appointments', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.*,
                CONCAT(p.first_name, ' ', p.last_name) as patient_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            WHERE a.doctor_id = ?
            ORDER BY a.appointment_date, a.appointment_time`,
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;