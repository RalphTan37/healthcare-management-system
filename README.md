# Healthcare Management System

A web-based healthcare management system built with React, Node.js, and MySQL. This system helps manage patients, doctors, and appointments efficiently.

## Features

### Patient Management
- View list of all patients
- Add new patients
- View patient details
- Search patients
- Update Patient Information
- Delete patients

### Doctor Management
- View list of all doctors
- Add new doctors
- View doctor details
- Track doctor specializations and qualifications

### Appointment System
- Schedule new appointments
- View upcoming and past appointments
- Cancel appointments
- Filter appointments by status
- Check doctor availability

### General Features
- Responsive design
- User-friendly interface
- Contact form
- About page with mission and vision
- Services information

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- CSS for styling
- Font Awesome for icons

### Backend
- Node.js
- Express.js
- MySQL for database
- CORS for cross-origin requests

## Database Schema

### Doctors Table
```sql
CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(100),
    experience INT,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Patients Table
```sql
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    CONSTRAINT valid_status CHECK (status IN ('scheduled', 'completed', 'cancelled'))
);
```

## Setup Instructions

### Prerequisites
- Node.js
- MySQL
- npm

### Database Setup
1. Create MySQL database:
```sql
CREATE DATABASE healthcare_db;
```

2. Configure database connection:
Create `.env` file in server directory:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=healthcare_db
PORT=5000
```

### Installation

1. Clone the repository:
```bash
git clone 
cd healthcare-management-system
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend application:
```bash
cd client
npm start
```

3. Access the application at `http://localhost:3000`