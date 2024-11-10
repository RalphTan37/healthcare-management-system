import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = {
  // Patient endpoints
  async getPatients() {
    try {
      const response = await axios.get(`${API_URL}/patients`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  async createPatient(patientData) {
    const response = await axios.post(`${API_URL}/patients`, patientData);
    return response.data;
  },

  // Doctor endpoints
  async getDoctors() {
    try {
      const response = await axios.get(`${API_URL}/doctors`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  async createDoctor(doctorData) {
    const response = await axios.post(`${API_URL}/doctors`, doctorData);
    return response.data;
  },

  // Appointment endpoints
  async getAppointments() {
    try {
      const response = await axios.get(`${API_URL}/appointments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  async createAppointment(appointmentData) {
    const response = await axios.post(`${API_URL}/appointments`, appointmentData);
    return response.data;
  },

  async cancelAppointment(id) {
    const response = await axios.patch(`${API_URL}/appointments/${id}/cancel`);
    return response.data;
  },

  async getAvailableSlots(doctorId, date) {
    const response = await axios.get(`${API_URL}/appointments/available-slots`, {
      params: { doctorId, date }
    });
    return response.data;
  }
};