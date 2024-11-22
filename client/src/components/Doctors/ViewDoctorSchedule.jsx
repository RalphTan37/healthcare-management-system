import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import './Doctors.css';

const ViewDoctorSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const [doctorData, appointmentsData] = await Promise.all([
          api.getDoctor(id),
          api.getDoctorAppointments(id)
        ]);
        setDoctor(doctorData);
        setAppointments(appointmentsData);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching schedule');
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const filteredAppointments = appointments.filter(apt => 
    apt.appointment_date.split('T')[0] === selectedDate
  );

  return (
    <div className="schedule-container">
      {doctor && (
        <div className="doctor-info">
          <h2>Dr. {doctor.first_name} {doctor.last_name}'s Schedule</h2>
          <p>Specialization: {doctor.specialization}</p>
        </div>
      )}

      <div className="date-selector">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="appointments-list">
        {filteredAppointments.length === 0 ? (
          <p>No appointments scheduled for this date</p>
        ) : (
          filteredAppointments.map(apt => (
            <div key={apt.appointment_id} className="appointment-card">
              <p>Time: {apt.appointment_time}</p>
              <p>Patient: {apt.patient_name}</p>
              <p>Status: {apt.status}</p>
            </div>
          ))
        )}
      </div>

      <div className="actions">
        <button className="btn secondary" onClick={() => navigate('/doctors')}>
          Back to Doctors List
        </button>
      </div>
    </div>
  );
};

export default ViewDoctorSchedule;