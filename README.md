# 💰 Smart Expense Tracking System

## 📌 Project Description

The Smart Expense Tracking System is a full-stack web application that helps users manage their income and expenses efficiently. It provides real-time tracking, analytics, and automated balance updates using database triggers.

This project demonstrates a **hybrid database architecture** using **MySQL (structured data)** and **MongoDB (unstructured logs)**.

---

## 🚀 Features

* 🔐 User Authentication (Login/Register with JWT)
* ➕ Add Transactions (Income & Expense)
* ❌ Delete Transactions
* 📊 Dashboard with Analytics (Charts)
* 💰 Automatic Balance Update using MySQL Triggers
* 🧾 Activity Logging using MongoDB
* 📱 Responsive UI

---

## 🧠 Key Concepts Used

* Relational Database (MySQL)
* NoSQL Database (MongoDB)
* Database Triggers
* REST APIs
* JWT Authentication
* Full Stack Development

---

## 🏗️ System Architecture

```
React Frontend
      ↓
Node.js Backend (Express)
      ↓
MySQL (Users, Accounts, Transactions)
MongoDB (Activity Logs)
      ↓
Triggers (Auto balance update + logging)
```

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Router DOM
* Axios
* Recharts

### Backend

* Node.js
* Express.js
* MySQL2
* Mongoose
* jsonwebtoken (JWT)
* bcryptjs
* dotenv
* cors

---

## 📂 Project Structure

```
smart-expense-tracker/
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── mongo.js
│   ├── models/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone Repository

```
git clone https://github.com/your-username/smart-expense-tracker.git
cd smart-expense-tracker
```

---

### 🔹 2. Setup Backend

```
cd backend
npm install
```

Create `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker
PORT=5000
JWT_SECRET=your_secret_key
```

Run backend:

```
node server.js
```

---

### 🔹 3. Setup Frontend

```
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
| POST   | /login            | User login          |
| POST   | /register         | User registration   |
| POST   | /transactions     | Add transaction     |
| DELETE | /transactions/:id | Delete transaction  |
| GET    | /transactions     | Fetch transactions  |
| GET    | /logs             | Fetch activity logs |

---

## 🔥 Innovative Features

* Hybrid Database (MySQL + MongoDB)
* Trigger-based automation for balance updates
* Real-time analytics dashboard

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
