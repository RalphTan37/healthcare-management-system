const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Get all doctors
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM doctors ORDER BY last_name');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM doctors WHERE doctor_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new doctor
router.post('/', async (req, res) => {
    const { firstName, lastName, specialization, email, phone, qualification, experience } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO doctors (first_name, last_name, specialization, email, phone, qualification, experience) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, specialization, email, phone, qualification, experience]
        );
        const [newDoctor] = await pool.query('SELECT * FROM doctors WHERE doctor_id = ?', [result.insertId]);
        res.status(201).json(newDoctor[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update doctor
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

// Delete doctor
router.delete('/:id', async (req, res) => {
    try {
        // First check if doctor exists
        const [doctor] = await pool.query('SELECT * FROM doctors WHERE doctor_id = ?', [req.params.id]);
        if (doctor.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check if doctor has appointments
        const [appointments] = await pool.query('SELECT * FROM appointments WHERE doctor_id = ?', [req.params.id]);
        if (appointments.length > 0) {
            return res.status(400).json({ message: 'Cannot delete doctor with existing appointments' });
        }

        await pool.query('DELETE FROM doctors WHERE doctor_id = ?', [req.params.id]);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get doctor's schedule
router.get('/:id/schedule', async (req, res) => {
    try {
        const [appointments] = await pool.query(
            `SELECT appointments.*, 
            patients.first_name as patient_first_name, 
            patients.last_name as patient_last_name
            FROM appointments 
            JOIN patients ON appointments.patient_id = patients.patient_id
            WHERE doctor_id = ? AND appointment_date >= CURDATE()
            ORDER BY appointment_date, appointment_time`,
            [req.params.id]
        );
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;