# 💼 HireHub Project

A full-stack HireHub web application that connects job seekers with recruiters. Users can register, log in, search and apply for jobs, while recruiters can post, manage, and review job applications.

## 🚀 Features

### 👤 For Job Seekers:
- User authentication (Clerk)
- Browse and search for jobs
- Apply to jobs
- Track applications

### 🧑‍💼 For Recruiters:
- JWT-based authentication and protected routes
- Post and manage job listings
- View and manage applications

### 🔐 Authentication
- **Clerk** is used for user authentication (job seekers)
- **JWT** is used for recruiter authentication and authorization
- Role-based route protection using custom middleware

## 🛠️ Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- Axios

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for secure APIs

## 📁 Project Structure

client/ # React frontend
├── src/
│ ├── components/ # Reusable components
│ ├── pages/ # Route-based pages
│ └── App.jsx # Main component

server/ # Express backend
├── models/ # Mongoose models
├── routes/ # Express routes
├── controllers/ # Business logic
└── middleware/ # Auth middlewares


## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/job-portal.git
cd job-portal

Setup the backend

cd server
npm install
Create a `.env` file and add:
MONGO_URI=mongodb://localhost:27017/Freelance
PORT=8800
npm run dev

Setup the frontend

cd ../client
npm install
npm start
