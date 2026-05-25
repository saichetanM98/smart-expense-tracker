# 💰 Smart Expense Tracking System

## 📌 Project Description

The Smart Expense Tracking System is a full-stack web application that helps users manage their income and expenses efficiently. It provides real-time tracking, analytics, activity logging, and smart spending suggestions.

This project uses **MySQL** as the sole database for all structured data including users, transactions, categories, accounts, and activity logs.

---

## 🚀 Features

* 🔐 User Authentication (Login/Register with JWT)
* ➕ Add Transactions (Income & Expense)
* ❌ Delete Transactions
* 📊 Dashboard with Analytics (Charts)
* 💰 Automatic Balance Calculation
* 🧾 Activity Logging (MySQL)
* 📈 Stored Procedure for Monthly Expense
* 💡 Smart Spending Suggestions & Overspending Alerts
* 📱 Responsive UI

---

## 🧠 Key Concepts Used

* Relational Database (MySQL)
* Stored Procedures
* REST APIs
* JWT Authentication
* Full Stack Development (React + Node.js)

---

## 🏗️ System Architecture

```
React Frontend (Vite)
        ↓
Node.js Backend (Express)
        ↓
      MySQL
        ├── users
        ├── accounts
        ├── categories
        ├── transactions
        └── logs (activity)
```

---

## 🛠️ Tech Stack

### Frontend
* React (Vite)
* React Router DOM
* Axios
* Recharts

### Backend
* Node.js + Express.js
* MySQL2
* jsonwebtoken (JWT)
* bcryptjs
* dotenv + cors

---

## 📂 Project Structure

```
smart-expense-tracker/
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── context/
│       └── services/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── schema.sql
│   ├── setup.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js (v18+)
* MySQL (running locally)

---

### 🔹 1. Clone Repository

```bash
git clone https://github.com/saichetanM98/smart-expense-tracker.git
cd smart-expense-tracker
```

---

### 🔹 2. Setup Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker
PORT=5000
JWT_SECRET=any_random_secret_string
CLIENT_URL=http://localhost:5173
```

Create database and tables:

```bash
node setup.js
```

Start backend:

```bash
node server.js
```

You should see:
```
✅ MySQL Connected
🚀 Server running on http://127.0.0.1:5000
```

---

### 🔹 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## 🧪 API Endpoints

| Method | Endpoint          | Description                        |
| ------ | ----------------- | ---------------------------------- |
| POST   | /register         | User registration                  |
| POST   | /login            | User login                         |
| GET    | /transactions     | Fetch all transactions             |
| POST   | /transactions     | Add a transaction                  |
| DELETE | /transactions/:id | Delete a transaction               |
| GET    | /monthly-expense  | Get monthly expense (stored proc)  |
| GET    | /logs             | Fetch activity logs                |

---

## 🗄️ Database Schema

| Table        | Description                          |
| ------------ | ------------------------------------ |
| users        | Stores user credentials              |
| accounts     | User's general account               |
| categories   | Transaction categories               |
| transactions | All income & expense records         |
| logs         | Activity logs (login, add, delete)   |

---

## 🔥 Innovative Features

* Stored Procedure — `GetMonthlyExpense` for monthly totals
* Activity logging for every user action
* Real-time analytics dashboard
* JWT-based secure authentication
* Smart spending suggestions & overspending alerts

---

## 🎯 Future Enhancements

* Budget tracking system
* Notifications for overspending
* Cloud deployment
* Mobile application

---

## 👨‍💻 Authors

* Sai Chetan [1RN24CY040]
* Vishwanath [1RN24CY053]
* Amulya I V [1RN24CY005]

---

## 📜 License

This project is developed for academic purposes only.
