import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './components/Home/Home';
import About from './components/About/About';
import Services from './components/Services/Services';
import Contact from './components/Contact/Contact';
import PatientList from './components/Patients/PatientList';
import PatientForm from './components/Patients/PatientForm';
import EditPatient  from './components/Patients/EditPatient';
import ViewPatient from './components/Patients/ViewPatient';
import DoctorList from './components/Doctors/DoctorList';
import EditDoctor from './components/Doctors/EditDoctor';
import ViewDoctorSchedule from './components/Doctors/ViewDoctorSchedule';
import DoctorForm from './components/Doctors/DoctorForm';
import AppointmentList from './components/Appointments/AppointmentList';
import AppointmentForm from './components/Appointments/AppointmentForm';
import EditAppointment from './components/Appointments/EditAppointment';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import PatientDashboard from './components/Dashboard/PatientDashboard';
import PatientSearch from './components/Patients/PatientSearch';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="app">
        {user && <Navbar />}
        <main>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" /> : <Register />} 
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/patients"
              element={user ? <PatientList /> : <Navigate to="/login" />}
            />
            <Route
              path="/patients/new"
              element={user ? <PatientForm /> : <Navigate to="/login" />}
            />
            <Route
              path="/doctors"
              element={user ? <DoctorList /> : <Navigate to="/login" />}
            />
            <Route
              path="/doctors/new"
              element={user ? <DoctorForm /> : <Navigate to="/login" />}
            />

            <Route 
              path="/doctors/:id/edit" 
              element={!user ? <Navigate to="/login" /> : <EditDoctor />} 
            />

            <Route
              path="/appointments"
              element={user ? <AppointmentList /> : <Navigate to="/login" />}
            />
            <Route
              path="/appointments/new"
              element={user ? <AppointmentForm /> : <Navigate to="/login" />}
            />

            <Route 
              path="/appointments/:id/edit" 
              element={!user ? <Navigate to="/login" /> : <EditAppointment />} 
            />

            <Route
              path="/patients/:id/edit"
              element={!user ? <Navigate to="/login" /> : <EditPatient />}
            />

            <Route 
              path="/patients/:id" 
              element={!user ? <Navigate to="/login" /> : <ViewPatient />} 
            />

            <Route 
              path="/patients/search" 
              element={!user ? <Navigate to="/login" /> : <PatientSearch />} 
            />
            
            <Route
              path="/doctors/:id/edit"
              element={!user ? <Navigate to="/login" /> : <EditDoctor />}
            />

            <Route 
              path="/doctors/schedule/:id" 
              element={!user ? <Navigate to="/login" /> : <ViewDoctorSchedule />} 
            />
            
            <Route 
              path="/doctors/:id/edit" 
              element={!user ? <Navigate to="/login" /> : <EditDoctor />} 
            />
            
            <Route
              path="/about"
              element={user ? <About /> : <Navigate to="/login" />}
            />
            <Route
              path="/services"
              element={user ? <Services /> : <Navigate to="/login" />}
            />
            <Route
              path="/contact"
              element={user ? <Contact /> : <Navigate to="/login" />}
            />

            {/* Role-based Dashboards */}
            <Route
              path="/admin/*"
              element={
                !user ? (
                  <Navigate to="/login" />
                ) : user.role !== 'admin' ? (
                  <Navigate to="/" />
                ) : (
                  <AdminDashboard />
                )
              }
            />
            <Route
              path="/doctor/*"
              element={
                !user ? (
                  <Navigate to="/login" />
                ) : user.role !== 'doctor' ? (
                  <Navigate to="/" />
                ) : (
                  <DoctorDashboard />
                )
              }
            />
            <Route
              path="/patient/*"
              element={
                !user ? (
                  <Navigate to="/login" />
                ) : user.role !== 'patient' ? (
                  <Navigate to="/" />
                ) : (
                  <PatientDashboard />
                )
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;