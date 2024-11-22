const express = require('express');
const router = express.Router();
const pool = require('../db/database');

router.get('/search', async (req, res) => {
    try {
        const { term } = req.query;
        if (!term) return res.json([]);

        const [results] = await pool.query(`
            SELECT * FROM patients 
            WHERE LOWER(first_name) LIKE LOWER(?) 
            OR LOWER(last_name) LIKE LOWER(?)
            OR LOWER(email) LIKE LOWER(?)
            OR phone LIKE ?`,
            [`%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`]
        );
        
        res.json(results);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Error searching patients' });
    }
});

// Create Patient (Already implemented)
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

// Read All Patients (Already implemented)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM patients ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read Single Patient
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

// Update Patient
router.put('/:id', async (req, res) => {
    const { firstName, lastName, dateOfBirth, gender, email, phone, address } = req.body;
    try {
        await pool.query(
            'UPDATE patients SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, email = ?, phone = ?, address = ? WHERE patient_id = ?',
            [firstName, lastName, dateOfBirth, gender, email, phone, address, req.params.id]
        );
        const [updatedPatient] = await pool.query('SELECT * FROM patients WHERE patient_id = ?', [req.params.id]);
        res.json(updatedPatient[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Patient route
router.delete('/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // First check if patient exists
        const [patient] = await connection.query(
            'SELECT * FROM patients WHERE patient_id = ?',
            [req.params.id]
        );

        if (patient.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Delete related appointments first
        await connection.query(
            'DELETE FROM appointments WHERE patient_id = ?',
            [req.params.id]
        );

        // Then delete the patient
        await connection.query(
            'DELETE FROM patients WHERE patient_id = ?',
            [req.params.id]
        );

        await connection.commit();
        res.json({ message: 'Patient deleted successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('Error deleting patient:', err);
        res.status(500).json({ 
            error: 'Failed to delete patient', 
            details: err.message 
        });
    } finally {
        connection.release();
    }
});

// Search patient route
router.get('/search', async (req, res) => {
    try {
      const { term } = req.query;
      const [patients] = await pool.query(`
        SELECT p.*, 
          (SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'appointment_id', a.appointment_id,
              'appointment_date', a.appointment_date,
              'status', a.status,
              'doctor_name', CONCAT(d.first_name, ' ', d.last_name)
            )
          )
          FROM appointments a
          JOIN doctors d ON a.doctor_id = d.doctor_id
          WHERE a.patient_id = p.patient_id
          ORDER BY a.appointment_date DESC
          LIMIT 5) as recent_appointments
        FROM patients p
        WHERE 
          p.first_name LIKE ? OR 
          p.last_name LIKE ? OR 
          p.email LIKE ? OR 
          p.phone LIKE ?
        ORDER BY p.first_name, p.last_name
      `, [`%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`]);
  
      // Parse the JSON string of appointments for each patient
      const patientsWithAppointments = patients.map(patient => ({
        ...patient,
        appointments: JSON.parse(patient.recent_appointments || '[]')
      }));
  
      res.json(patientsWithAppointments);
    } catch (err) {
      console.error('Search error:', err);
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;