-- Insert sample doctors
INSERT INTO doctors (first_name, last_name, specialization, qualification, experience, email, phone) VALUES
('John', 'Doe', 'Cardiology', 'MD, FACC', 10, 'john.doe@example.com', '555-0101'),
('Jane', 'Smith', 'Pediatrics', 'MD', 8, 'jane.smith@example.com', '555-0102'),
('Robert', 'Johnson', 'Orthopedics', 'MD, FAAOS', 12, 'robert.j@example.com', '555-0103');

-- Insert sample patients
INSERT INTO patients (first_name, last_name, date_of_birth, gender, email, phone, address) VALUES
('Alice', 'Brown', '1990-05-15', 'female', 'alice.b@example.com', '555-0201', '123 Main St'),
('Bob', 'Wilson', '1985-08-22', 'male', 'bob.w@example.com', '555-0202', '456 Oak Ave'),
('Carol', 'Taylor', '1995-03-10', 'female', 'carol.t@example.com', '555-0203', '789 Pine Rd');