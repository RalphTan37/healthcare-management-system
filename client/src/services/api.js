import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth methods
  async register(userData) {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Patient methods
  async getPatients() {
    const response = await axiosInstance.get('/patients');
    return response.data;
  },

  async getPatient(id) {
    const response = await axiosInstance.get(`/patients/${id}`);
    return response.data;
  },

  async createPatient(data) {
    const response = await axiosInstance.post('/patients', data);
    return response.data;
  },

  async updatePatient(id, data) {
    const response = await axiosInstance.put(`/patients/${id}`, data);
    return response.data;
  },

  async deletePatient(id) {
    const response = await axiosInstance.delete(`/patients/${id}`);
    return response.data;
  },

  async searchPatients(searchTerm) {
    const response = await axiosInstance.get(`/patients/search?term=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  async cancelAllPatientAppointments(patientId) {
    const response = await axiosInstance.post(`/patients/${patientId}/cancel-appointments`);
    return response.data;
  },

  async updateAppointment(id, appointmentData) {
    const response = await axiosInstance.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Doctor methods
  async getDoctors() {
    const response = await axiosInstance.get('/doctors');
    return response.data;
  },

  async getDoctor(id) {
    const response = await axiosInstance.get(`/doctors/${id}`);
    return response.data;
  },

  async createDoctor(data) {
    const response = await axiosInstance.post('/doctors', data);
    return response.data;
  },

  async updateDoctor(id, data) {
    const response = await axiosInstance.put(`/doctors/${id}`, data);
    return response.data;
  },

  async deleteDoctor(id) {
    const response = await axiosInstance.delete(`/doctors/${id}`);
    return response.data;
  },

  async getDoctorAppointments(id) {
    const response = await axiosInstance.get(`/doctors/${id}/appointments`);
    return response.data;
  },

  // Appointment methods
  async getAppointments() {
    const response = await axiosInstance.get('/appointments');
    return response.data;
  },

  async getAppointment(id) {
    const response = await axiosInstance.get(`/appointments/${id}`);
    return response.data;
  },

  async createAppointment(data) {
    const response = await axiosInstance.post('/appointments', data);
    return response.data;
  },

  async updateAppointment(id, data) {
    const response = await axiosInstance.put(`/appointments/${id}`, data);
    return response.data;
  },

  async cancelAppointment(id) {
    const response = await axiosInstance.delete(`/appointments/${id}`);
    return response.data;
  },

  async getAvailableSlots(doctorId, date) {
    try {
      const response = await axiosInstance.get('/appointments/available-slots', {
        params: { doctorId, date }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching slots:', error);
      throw error;
    }
  }
};