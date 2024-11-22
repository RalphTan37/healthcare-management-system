import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Dashboard.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await api.getDoctorAppointments(user.id);
        setAppointments(data);
        setTodayAppointments(data.filter(apt => {
          const today = new Date().toISOString().split('T')[0];
          return apt.appointment_date === today;
        }));
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, [user.id]);

  return (
    <div className="dashboard-container">
      <h2>Doctor Dashboard</h2>
      <div className="today-appointments">
        <h3>Today's Appointments</h3>
        <div className="appointments-list">
          {todayAppointments.map(apt => (
            <div key={apt.appointment_id} className="appointment-card">
              <p><strong>Time:</strong> {apt.appointment_time}</p>
              <p><strong>Patient:</strong> {apt.patient_name}</p>
              <p><strong>Reason:</strong> {apt.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;