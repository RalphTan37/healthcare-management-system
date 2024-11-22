import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [doctors, patients, appointments] = await Promise.all([
          api.getDoctors(),
          api.getPatients(),
          api.getAppointments()
        ]);
        setStats({
          totalDoctors: doctors.length,
          totalPatients: patients.length,
          totalAppointments: appointments.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <i className="fas fa-user-md"></i>
          <h3>Total Doctors</h3>
          <p>{stats.totalDoctors}</p>
          <button onClick={() => window.location.href='/doctors'}>Manage Doctors</button>
        </div>
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <h3>Total Patients</h3>
          <p>{stats.totalPatients}</p>
          <button onClick={() => window.location.href='/patients'}>Manage Patients</button>
        </div>
        <div className="stat-card">
          <i className="fas fa-calendar-check"></i>
          <h3>Total Appointments</h3>
          <p>{stats.totalAppointments}</p>
          <button onClick={() => window.location.href='/appointments'}>View Appointments</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;