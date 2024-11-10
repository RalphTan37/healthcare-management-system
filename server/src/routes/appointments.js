const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.*,
                CONCAT(p.first_name, ' ', p.last_name) as patient_name,
                CONCAT(d.first_name, ' ', d.last_name) as doctor_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            JOIN doctors d ON a.doctor_id = d.doctor_id
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get available time slots for a doctor on a specific date
router.get('/available-slots', async (req, res) => {
    const { doctorId, date } = req.query;
    
    try {
        // Define working hours (9 AM to 5 PM)
        const workingHours = [];
        for (let hour = 9; hour < 17; hour++) {
            workingHours.push(`${hour.toString().padStart(2, '0')}:00:00`);
            workingHours.push(`${hour.toString().padStart(2, '0')}:30:00`);
        }

        // Get booked appointments
        const [bookedSlots] = await pool.query(
            'SELECT appointment_time FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND status != "cancelled"',
            [doctorId, date]
        );

        // Filter out booked slots
        const bookedTimes = bookedSlots.map(slot => slot.appointment_time);
        const availableSlots = workingHours.filter(time => !bookedTimes.includes(time));

        res.json(availableSlots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single appointment
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.*,
                CONCAT(p.first_name, ' ', p.last_name) as patient_name,
                CONCAT(d.first_name, ' ', d.last_name) as doctor_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.appointment_id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new appointment
router.post('/', async (req, res) => {
    const { patientId, doctorId, appointmentDate, appointmentTime, reason } = req.body;
    
    try {
        // Check if slot is available
        const [existingAppointment] = await pool.query(
            'SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != "cancelled"',
            [doctorId, appointmentDate, appointmentTime]
        );

        if (existingAppointment.length > 0) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }

        const [result] = await pool.query(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, "scheduled")',
            [patientId, doctorId, appointmentDate, appointmentTime, reason]
        );

        const [newAppointment] = await pool.query(`
            SELECT 
                a.*,
                CONCAT(p.first_name, ' ', p.last_name) as patient_name,
                CONCAT(d.first_name, ' ', d.last_name) as doctor_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.appointment_id = ?
        `, [result.insertId]);

        res.status(201).json(newAppointment[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update appointment
router.put('/:id', async (req, res) => {
    const { patientId, doctorId, appointmentDate, appointmentTime, reason, status } = req.body;
    
    try {
        // Check if the appointment exists
        const [existingAppointment] = await pool.query(
            'SELECT * FROM appointments WHERE appointment_id = ?',
            [req.params.id]
        );

        if (existingAppointment.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // If changing time, check if new slot is available
        if (appointmentDate && appointmentTime) {
            const [conflictingAppointment] = await pool.query(
                'SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND appointment_id != ? AND status != "cancelled"',
                [doctorId, appointmentDate, appointmentTime, req.params.id]
            );

            if (conflictingAppointment.length > 0) {
                return res.status(400).json({ message: 'This time slot is already booked' });
            }
        }

        await pool.query(
            'UPDATE appointments SET patient_id = ?, doctor_id = ?, appointment_date = ?, appointment_time = ?, reason = ?, status = ? WHERE appointment_id = ?',
            [patientId, doctorId, appointmentDate, appointmentTime, reason, status, req.params.id]
        );

        const [updatedAppointment] = await pool.query(`
            SELECT 
                a.*,
                CONCAT(p.first_name, ' ', p.last_name) as patient_name,
                CONCAT(d.first_name, ' ', d.last_name) as doctor_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.appointment_id = ?
        `, [req.params.id]);

        res.json(updatedAppointment[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cancel appointment
router.patch('/:id/cancel', async (req, res) => {
    try {
        const [appointment] = await pool.query(
            'SELECT * FROM appointments WHERE appointment_id = ?',
            [req.params.id]
        );

        if (appointment.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await pool.query(
            'UPDATE appointments SET status = "cancelled" WHERE appointment_id = ?',
            [req.params.id]
        );

        res.json({ message: 'Appointment cancelled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get appointments by doctor
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.*,
                CONCAT(p.first_name, ' ', p.last_name) as patient_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            WHERE a.doctor_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `, [req.params.doctorId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get appointments by patient
router.get('/patient/:patientId', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.*,
                CONCAT(d.first_name, ' ', d.last_name) as doctor_name
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.patient_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `, [req.params.patientId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;