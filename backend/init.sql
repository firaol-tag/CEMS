CREATE DATABASE IF NOT EXISTS cems;
USE cems;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120),
  email VARCHAR(180) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50),
  created_at DATETIME
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  email VARCHAR(180) UNIQUE,
  phone VARCHAR(50),
  gender VARCHAR(50),
  location VARCHAR(120),
  customer_type ENUM('g-power','five-star','regular') DEFAULT 'regular',
  last_purchase_date DATE,
  created_at DATETIME
);

CREATE TABLE IF NOT EXISTS customer_segments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  filter_json TEXT,
  created_at DATETIME
);

CREATE TABLE IF NOT EXISTS campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type ENUM('email','sms','both') DEFAULT 'email',
  target_type ENUM('all','specific','filtered') DEFAULT 'all',
  target_data TEXT,
  status ENUM('draft','scheduled','sent') DEFAULT 'draft',
  scheduled_at DATETIME NULL,
  created_by INT,
  created_at DATETIME
);

CREATE TABLE IF NOT EXISTS message_queue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  campaign_id INT NOT NULL,
  channel ENUM('email','sms') NOT NULL,
  status ENUM('pending','sent','failed') DEFAULT 'pending',
  retry_count INT DEFAULT 0,
  scheduled_at DATETIME NULL,
  created_at DATETIME,
  updated_at DATETIME NULL
);
