-- Run this manually in MySQL Workbench after running setup.js
USE expense_tracker;

DROP PROCEDURE IF EXISTS GetMonthlyExpense;

DELIMITER $$
CREATE PROCEDURE GetMonthlyExpense(IN uid INT)
BEGIN
  SELECT
    DATE_FORMAT(date, '%Y-%m') AS month,
    SUM(amount) AS total_expense
  FROM transactions
  WHERE user_id = uid AND transaction_type = 'expense'
  GROUP BY DATE_FORMAT(date, '%Y-%m')
  ORDER BY month DESC;
END$$
DELIMITER ;
