CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

CREATE TABLE IF NOT EXISTS users (
  user_id   INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100)  NOT NULL,
  email     VARCHAR(100)  NOT NULL UNIQUE,
  password  VARCHAR(255)  NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts (
  account_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  account_type VARCHAR(50) DEFAULT 'general',
  balance      DECIMAL(10,2) DEFAULT 0.00,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  category_id   INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE
);

INSERT IGNORE INTO categories (category_name) VALUES
  ('Food'),('Transport'),('Shopping'),('Health'),
  ('Entertainment'),('Other'),('Salary'),('Freelance'),
  ('Investment'),('Gift');

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  account_id       INT,
  category_id      INT,
  amount           DECIMAL(10,2) NOT NULL,
  transaction_type ENUM('income','expense') NOT NULL,
  date             DATE NOT NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(user_id)       ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT,
  action VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id)
    REFERENCES transactions(transaction_id)
    ON DELETE CASCADE
);