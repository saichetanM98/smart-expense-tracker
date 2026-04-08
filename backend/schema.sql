CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  type ENUM('income','expense') NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Trigger: log summary after INSERT into Transactions
DELIMITER $$

CREATE TRIGGER IF NOT EXISTS after_transaction_insert
AFTER INSERT ON Transactions
FOR EACH ROW
BEGIN
  INSERT INTO TransactionLogs (user_id, transaction_id, action, amount, category, type, logged_at)
  VALUES (NEW.user_id, NEW.id, 'INSERT', NEW.amount, NEW.category, NEW.type, NOW());
END$$

-- Trigger: log summary after DELETE from Transactions
CREATE TRIGGER IF NOT EXISTS after_transaction_delete
AFTER DELETE ON Transactions
FOR EACH ROW
BEGIN
  INSERT INTO TransactionLogs (user_id, transaction_id, action, amount, category, type, logged_at)
  VALUES (OLD.user_id, OLD.id, 'DELETE', OLD.amount, OLD.category, OLD.type, NOW());
END$$

DELIMITER ;

-- Table used by MySQL triggers
CREATE TABLE IF NOT EXISTS TransactionLogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  transaction_id INT NOT NULL,
  action VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2),
  category VARCHAR(100),
  type VARCHAR(20),
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
