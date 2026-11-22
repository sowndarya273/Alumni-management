CREATE DATABASE IF NOT EXISTS alumni_db;
USE alumni_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','alumni','student') NOT NULL DEFAULT 'alumni',
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id INT PRIMARY KEY,
  phone VARCHAR(20),
  graduation_year YEAR,
  department VARCHAR(100),
  degree VARCHAR(100),
  company VARCHAR(150),
  job_title VARCHAR(150),
  location VARCHAR(150),
  linkedin VARCHAR(255),
  bio TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  venue VARCHAR(200),
  event_date DATETIME NOT NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'published',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  user_id INT NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_event_user (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  company VARCHAR(150) NOT NULL,
  location VARCHAR(150),
  job_type ENUM('Full-time','Part-time','Internship','Contract') NOT NULL DEFAULT 'Full-time',
  description TEXT,
  requirements TEXT,
  apply_link VARCHAR(255),
  status ENUM('draft','published') NOT NULL DEFAULT 'published',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
