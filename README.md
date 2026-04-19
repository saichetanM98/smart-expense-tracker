# 💰 Smart Expense Tracking System

## 📌 Project Description

The Smart Expense Tracking System is a full-stack web application that helps users manage their income and expenses efficiently. It provides real-time tracking, analytics, and automated balance updates.

This project demonstrates a **hybrid database architecture** using **MySQL (structured data)** and **MongoDB (unstructured logs)**.

---

## 🚀 Features

* 🔐 User Authentication (Login/Register with JWT)
* ➕ Add Transactions (Income & Expense)
* ❌ Delete Transactions
* 📊 Dashboard with Analytics (Charts)
* 💰 Automatic Balance Update
* 🧾 Activity Logging using MongoDB
* 📱 Responsive UI

---

## 🧠 Key Concepts Used

* Relational Database (MySQL)
* NoSQL Database (MongoDB)
* REST APIs
* JWT Authentication
* Full Stack Development

---

## 🏗️ System Architecture

```
React Frontend (Vite)
      ↓
Node.js Backend (Express)
      ↓
MySQL (Users, Accounts, Categories, Transactions)
MongoDB (Activity Logs)
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
* Mongoose
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
│   ├── mongodb.js
│   ├── schema.sql
│   ├── setup.js
│   ├── .env.example
│   └── models/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js (v18+)
* MySQL (running locally)
* MongoDB (optional — logs disabled if not running)

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
MONGO_URI=mongodb://localhost:27017/expense_tracker_logs
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

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| POST   | /register         | User registration   |
| POST   | /login            | User login          |
| GET    | /transactions     | Fetch transactions  |
| POST   | /transactions     | Add transaction     |
| DELETE | /transactions/:id | Delete transaction  |
| GET    | /logs             | Fetch activity logs |

---

## 🔥 Innovative Features

* Hybrid Database (MySQL + MongoDB)
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
