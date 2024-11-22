import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Dashboard.css';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await api.getPatientAppointments(user.id);
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, [user.id]);

  return (
    <div className="dashboard-container">
      <h2>Patient Dashboard</h2>
      <div className="dashboard-actions">
        <button onClick={() => window.location.href='/appointments/new'} className="btn primary">
          Book New Appointment
        </button>
      </div>
      <div className="appointments-section">
        <h3>Your Appointments</h3>
        <div className="appointments-list">
          {appointments.map(apt => (
            <div key={apt.appointment_id} className="appointment-card">
              <p><strong>Date:</strong> {apt.appointment_date}</p>
              <p><strong>Time:</strong> {apt.appointment_time}</p>
              <p><strong>Doctor:</strong> {apt.doctor_name}</p>
              <p><strong>Status:</strong> {apt.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;