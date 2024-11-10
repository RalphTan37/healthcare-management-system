const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Get all patients
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM patients ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM patients WHERE patient_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new patient
router.post('/', async (req, res) => {
    const { firstName, lastName, dateOfBirth, gender, email, phone, address } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO patients (first_name, last_name, date_of_birth, gender, email, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, dateOfBirth, gender, email, phone, address]
        );
        const [newPatient] = await pool.query('SELECT * FROM patients WHERE patient_id = ?', [result.insertId]);
        res.status(201).json(newPatient[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;