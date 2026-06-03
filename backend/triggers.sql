-- Run this manually in MySQL Workbench after running setup.js
USE expense_tracker;

DROP TRIGGER IF EXISTS after_transaction_insert;
DROP TRIGGER IF EXISTS after_transaction_delete;

DELIMITER $$

CREATE TRIGGER after_transaction_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
  INSERT INTO logs (user_id, user_email, action, details, status)
  SELECT NEW.user_id, u.email, 'ADD_TRANSACTION',
    CONCAT('{"transaction_id":', NEW.transaction_id, '}'), 'success'
  FROM users u WHERE u.user_id = NEW.user_id;
END$$

CREATE TRIGGER after_transaction_delete
AFTER DELETE ON transactions
FOR EACH ROW
BEGIN
  INSERT INTO logs (user_id, user_email, action, details, status)
  SELECT OLD.user_id, u.email, 'DELETE_TRANSACTION',
    CONCAT('{"transaction_id":', OLD.transaction_id, '}'), 'success'
  FROM users u WHERE u.user_id = OLD.user_id;
END$$

DELIMITER ;
